from django.forms import ModelForm

from candidates.models import Candidate


class CandidateForm(ModelForm):
    class Meta:
        model = Candidate
        fields = ('email', 'name', 'cv')
