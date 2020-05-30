from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render
from rest_framework import viewsets, permissions

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



class KeywordsViewSet(viewsets.ModelViewSet):
    queryset = Keywords.objects.all()
    serializer_class = KeywordsSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

