import datetime
import os

from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from rest_framework import viewsets, permissions
from django.http import HttpResponse
import candidates.scanner.scan as scanner
import candidates.scanner.utils as utils

from .serializers import CandidateSerializer, KeywordsSerializer, JobSerializer
from candidates.models import Candidate, Keywords, Job


# Candidate ViewSet
class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]
    serializer_class = CandidateSerializer

    def perform_create(self, serializer):
        # serializer.save(owner=self.request.user)
        serializer.save(owner=User.objects.first())
        # The serializer will now have the 'owner' field by overriding the perform_create()

    # @staticmethod
    # def get_score_from_candidate():
    #     return Candidate.compute_score


def compute_score_view(request):
    start_time = datetime.datetime.now()
    scanner.convert_documents_to_txt('media')
    end_time = datetime.datetime.now()
    print("The processing of converting cvs has taken {} seconds".format(end_time - start_time))

    cvs_path = 'cv/converted_cvs_to_txt/cvs'
    job_description_path = 'cv/converted_cvs_to_txt/job_description/job_description.txt'
    cvs_with_skills_and_score = scanner.get_skills_and_score_for_all_cvs(cvs_path, job_description_path)

    for cv_name in cvs_with_skills_and_score:
        name = cv_name.split('.')[0]
        Candidate.objects.filter(cv__contains=name).update(score=cvs_with_skills_and_score[cv_name][2])
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


class KeywordsViewSet(viewsets.ModelViewSet):
    queryset = Keywords.objects.all()
    serializer_class = KeywordsSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
