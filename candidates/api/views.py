import datetime
import os
import json
from functools import wraps

from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from rest_framework import viewsets, permissions
from django.http import HttpResponse
import candidates.scanner.scan as scanner
import candidates.scanner.utils as utils
import candidates.scanner.train_spacy_ner as spacy_model
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

from .serializers import CandidateSerializer
from candidates.models import Candidate
from jobs.models import Keywords, Job


def permission_required(permission):
    def _permission_required(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            if not request.user.has_perm(permission):
                return Response(status=401)
            return func(self, request, *args, **kwargs)
        return wrapper
    return _permission_required


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]
    serializer_class = CandidateSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        name_of_cv = str(self.request.data.get('cv'))
        compute_score_at_addition(name_of_cv)
        # The serializer will now have the 'owner' field by overriding the perform_create()

    # @permission_required('candidates.delete_candidate')
    # def destroy(self, request, *args, **kwargs):
    #     if not request.user.has_perm('candidates.delete_candidate'):
    #         return Response(status=401)
    #     return super().destroy(request, *args, **kwargs)


@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_candidate_by_owner(request, id):
    owner = User.objects.get(id=id)
    candidate = Candidate.objects.filter(owner=owner).last()
    return Response(CandidateSerializer(candidate).data)


def compute_score_at_addition(cv_name):
    """
    Computes Score for only one CV at the addition time
    :param cv_name: the name of the file uploaded in the form
    :return: -
    """
    start_time = datetime.datetime.now()

    name_of_cv = cv_name.replace(' ', '_')
    name_without_termination = name_of_cv.split('.')[0]
    cv_root = 'media/cvs\\' + name_of_cv
    utils.convert_file(cv_root)

    cv_path = 'cv/converted_cvs_to_txt/cvs\\' + name_without_termination + '.txt'
    job_description_path = 'cv/converted_cvs_to_txt/job_description/job_description.txt'

    keywords = get_keywords_dict()
    default_score = Job.objects.first().default_score
    cv_with_skills_and_score = scanner.get_skill_and_score_for_one_cv(cv_path, job_description_path,
                                                                      keywords, default_score)
    spacy_model.summarize_text(cv_path)

    cv_summarized_path = 'cv/summarized_cvs_with_spacy/' + name_without_termination + '_Summarized.txt'

    with open(cv_summarized_path, 'r', encoding="utf8") as f:
        text = f.read()

    for cv_name in cv_with_skills_and_score:
        name = cv_name.split('.')[0]
        Candidate.objects.filter(cv__contains=name).update(matching_skills=cv_with_skills_and_score[cv_name][0],
                                                           missing_skills=cv_with_skills_and_score[cv_name][1],
                                                           score=cv_with_skills_and_score[cv_name][2],
                                                           summarized_cv=text, is_summarized=True)
    end_time = datetime.datetime.now()
    print("Processing one CV has taken IS: {} \n".format(end_time - start_time))
    return HttpResponseRedirect("/")


def compute_score_view(request):
    """
    Compute Score for all CVS found in cvs_path
    """
    start_time = datetime.datetime.now()
    scanner.convert_documents_to_txt('media/cvs')
    scanner.convert_documents_to_txt('media/job_description', 'cv/converted_cvs_to_txt/job_description')
    end_time = datetime.datetime.now()
    print("The processing of converting cvs has taken {} seconds".format(end_time - start_time))

    cvs_path = 'cv/converted_cvs_to_txt/cvs'
    job_description_path = 'cv/converted_cvs_to_txt/job_description/job_description.txt'
    keywords = get_keywords_dict()
    default_score = Job.objects.first().default_score

    cvs_with_skills_and_score = scanner.get_skills_and_score_for_all_cvs(cvs_path, job_description_path,
                                                                         keywords, default_score)

    for cv_name in cvs_with_skills_and_score:
        name = cv_name.split('.')[0]
        Candidate.objects.filter(cv__contains=name).update(matching_skills=cvs_with_skills_and_score[cv_name][0],
                                                           missing_skills=cvs_with_skills_and_score[cv_name][1],
                                                           score=cvs_with_skills_and_score[cv_name][2])
    end_time = datetime.datetime.now()

    print("The processing of {} cvs has taken {} seconds".format(len(cvs_with_skills_and_score), end_time - start_time))

    return HttpResponseRedirect("/")


def get_similar_cvs_view(request):
    similarity_matrix, position_and_cv_name = scanner.compute_similarity_of_all_cvs('cv/converted_cvs_to_txt/cvs',
                                                                                    'cv/converted_cvs_to_txt'
                                                                                    '/job_description'
                                                                                    '/job_description.txt')
    top = scanner.get_top_similar_cvs(similarity_matrix, position_and_cv_name)
    import json
    return HttpResponse(json.dumps(top))


def get_similarities_of_one_cv_hr_side(request, id):
    similarity_matrix, position_and_cv_name = scanner.compute_similarity_of_all_cvs('cv/converted_cvs_to_txt/cvs',
                                                                                    'cv/converted_cvs_to_txt'
                                                                                    '/job_description'
                                                                                    '/job_description.txt')
    candidate = Candidate.objects.get(id=id)
    cv_name = str(candidate.cv).split('/')[-1].split('.')[0] + '.txt'
    top = scanner.get_top_similarities_for_one_cv(similarity_matrix, position_and_cv_name, cv_name)
    import json
    return HttpResponse(json.dumps(top))


@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_similarities_of_one_cv(request, id):
    similarity_matrix, position_and_cv_name = scanner.compute_similarity_of_all_cvs('cv/converted_cvs_to_txt/cvs',
                                                                                    'cv/converted_cvs_to_txt'
                                                                                    '/job_description'
                                                                                    '/job_description.txt')
    owner = User.objects.get(id=id)
    candidate = Candidate.objects.filter(owner=owner).last()
    cv_name = str(candidate.cv).split('/')[-1].split('.')[0] + '.txt'
    position_in_matrix = list(position_and_cv_name.keys())[list(position_and_cv_name.values()).index(cv_name)]
    percentages_of_similarity = similarity_matrix[position_in_matrix]
    largest_percentages = sorted(percentages_of_similarity, reverse=True)[1:4]
    top = {}
    for index in range(len(largest_percentages)):
        top[index] = float("{:.2f}".format(largest_percentages[index] * 100))
    return Response(top)


def summarize_all_cvs(request, root_dir='cv/converted_cvs_to_txt/cvs'):
    start_time = datetime.datetime.now()
    utils.go_through_dir_and_summarize(root_dir)

    summarized_cvs_dir = 'cv/summarized_cvs_with_spacy'
    for subdir, dirs, files in os.walk(summarized_cvs_dir):
        for file in files:
            path = os.path.join(subdir, file)
            with open(path, 'r', encoding="utf8") as f:
                text = f.read()
                name = path.split('\\')[-1].split('_Summarized')[0]
                Candidate.objects.filter(cv__contains=name).update(summarized_cv=text, is_summarized=True)
    end_time = datetime.datetime.now()
    print("The processing of summarizing cvs has taken {} seconds".format(end_time - start_time))
    return HttpResponseRedirect("/")


def summarize_cv_at_addition(cv_path):
    """
    :param cv_path: path through the cv.txt(included)
    :return:
    """
    spacy_model.summarize_text(cv_path)


def get_keywords_dict():
    dict_of_keywords = {}
    keywords = Keywords.objects.all()
    for k in keywords:
        dict_of_keywords[k.word] = k.weight
    return dict_of_keywords


@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_matching_skills(request, id):
    candidate = Candidate.objects.get(id=id)
    dictionary_of_skills = {'skills': candidate.matching_skills.split(',')}
    return Response(dictionary_of_skills)


@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_missing_skills(request, id):
    candidate = Candidate.objects.get(id=id)
    dictionary_of_skills = {'skills': candidate.missing_skills.split(',')}
    return Response(dictionary_of_skills)
