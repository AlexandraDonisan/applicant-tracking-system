from rest_framework import serializers
from candidates.models import Candidate, Keywords, Job


class CandidateSerializer(serializers.ModelSerializer):
    # score = serializers.SerializerMethodField(method_name='compute_score')
    # summarized_cv = serializers.SerializerMethodField(method_name='summarize_cv')
    # is_summarized = True

    class Meta:
        model = Candidate
        fields = '__all__'

    # @staticmethod
    # def compute_score(candidate):
    #     return candidate.compute_score()

    @staticmethod
    def summarize_cv(candidate):
        if candidate.is_summarized is False:
            summarized_cv = candidate.summarize_cv()
            if summarized_cv is not None:
                candidate.is_summarized = True
            return summarized_cv
        # return summarized_cv


class KeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
