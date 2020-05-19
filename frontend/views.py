from django.shortcuts import render
from django.views.generic.detail import DetailView
from rest_framework.generics import CreateAPIView

from candidates.api.serializers import CandidateSerializer
from candidates.models import Candidate


def index(requests):
    return render(requests, 'frontend/index.html')


class CandidatesDetailView(DetailView):
    model = Candidate
    template_name = 'frontend/index.html'


class CandidateCreate(CreateAPIView):
    serializer_class = CandidateSerializer
    template_name = 'frontend/index.html'


