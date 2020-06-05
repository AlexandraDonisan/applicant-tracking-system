from rest_framework import serializers
from jobs.models import Keywords, Job


class KeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
