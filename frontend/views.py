from django.shortcuts import render
from django.views.generic.detail import DetailView
from rest_framework.generics import CreateAPIView

from candidates.api.serializers import CandidateSerializer
from candidates.models import Candidate
from jobs.api.serializers import JobSerializer, KeywordsSerializer
from jobs.models import Job, Keywords


def index(requests):
    return render(requests, 'frontend/index.html')


class CandidatesDetailView(DetailView):
    model = Candidate
    template_name = 'frontend/index.html'


class CandidateCreate(CreateAPIView):
    serializer_class = CandidateSerializer
    template_name = 'frontend/index.html'


class JobDetailView(DetailView):
    model = Job
    template_name = 'frontend/index.html'


class JobCreate(CreateAPIView):
    serializer_class = JobSerializer
    template_name = 'frontend/index.html'


class KeywordsDetailView(DetailView):
    model = Keywords
    template_name = 'frontend/index.html'


class KeywordsCreate(CreateAPIView):
    serializer_class = KeywordsSerializer
    template_name = 'frontend/index.html'
