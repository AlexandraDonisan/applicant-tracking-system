from rest_framework import viewsets

from jobs.api.serializers import KeywordsSerializer, JobSerializer
from jobs.models import Keywords, Job


class KeywordsViewSet(viewsets.ModelViewSet):
    queryset = Keywords.objects.all()
    serializer_class = KeywordsSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
