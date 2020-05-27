from rest_framework import serializers
from candidates.models import Candidate, Keywords, Job


class CandidateSerializer(serializers.ModelSerializer):
    score = serializers.SerializerMethodField(method_name='compute_score')

    class Meta:
        model = Candidate
        fields = '__all__'

    def compute_score(self, candidate):
        return candidate.compute_score()


class KeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
