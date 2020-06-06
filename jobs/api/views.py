from rest_framework import viewsets

from jobs.api.serializers import KeywordsSerializer, JobSerializer
from jobs.models import Keywords, Job
import candidates.scanner.utils as utils


class KeywordsViewSet(viewsets.ModelViewSet):
    queryset = Keywords.objects.all()
    serializer_class = KeywordsSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def perform_create(self, serializer):
        serializer.save()
        job_description_name = str(self.request.data.get('job_description'))
        utils.convert_file(path='media/job_description\\' + job_description_name.replace(' ', '_'),
                           save_path='cv/converted_cvs_to_txt/job_description')
