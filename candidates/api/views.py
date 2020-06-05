import datetime
import os
import json

from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from rest_framework import viewsets, permissions
from django.http import HttpResponse
import candidates.scanner.scan as scanner
import candidates.scanner.utils as utils
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

from .serializers import CandidateSerializer
from candidates.models import Candidate


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]
    serializer_class = CandidateSerializer

    def perform_create(self, serializer):
        # serializer.save(owner=self.request.user)
        # compute_score_view(request)
        serializer.save(owner=User.objects.first())
        # The serializer will now have the 'owner' field by overriding the perform_create()


def compute_score_view(request, cvs_path='cv/converted_cvs_to_txt/cvs'):
    start_time = datetime.datetime.now()
    scanner.convert_documents_to_txt('media')
    end_time = datetime.datetime.now()
    print("The processing of converting cvs has taken {} seconds".format(end_time - start_time))

    # cvs_path = 'cv/converted_cvs_to_txt/cvs'
    job_description_path = 'cv/converted_cvs_to_txt/job_description/job_description.txt'
    cvs_with_skills_and_score = scanner.get_skills_and_score_for_all_cvs(cvs_path, job_description_path)

    for cv_name in cvs_with_skills_and_score:
        name = cv_name.split('.')[0]
        Candidate.objects.filter(cv__contains=name).update(matching_skills=cvs_with_skills_and_score[cv_name][0],
                                                           missing_skills=cvs_with_skills_and_score[cv_name][1],
                                                           score=cvs_with_skills_and_score[cv_name][2])
    return HttpResponseRedirect("/")


def get_similar_cvs_view(request):
    similarity_matrix, position_and_cv_name = scanner.compute_similarity_of_all_cvs('cv/converted_cvs_to_txt/cvs',
                                                                                    'cv/converted_cvs_to_txt'
                                                                                    '/job_description'
                                                                                    '/job_description.txt')
    top = scanner.get_top_similar_cvs(similarity_matrix, position_and_cv_name)
    import json
    return HttpResponse(json.dumps(top))


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


@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_matching_skills(request, id):
    candidate = Candidate.objects.get(id=id)
    dictionary_of_skills = {'skills': candidate.matching_skills.split(' ')}
    return Response(dictionary_of_skills)


@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_missing_skills(request, id):
    candidate = Candidate.objects.get(id=id)
    dictionary_of_skills = {'skills': candidate.missing_skills.split(' ')}
    return Response(dictionary_of_skills)
