from django.http import HttpResponseRedirect
from django.shortcuts import render
from rest_framework import viewsets, permissions

from .forms import CandidateForm
from .serializers import CandidateSerializer
from candidates.models import Candidate


# Candidate ViewSet
class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = CandidateSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        # The serializer will now have the 'owner' field by overriding the perform_create()

    @staticmethod
    def get_score_from_candidate():
        return Candidate.compute_score


def create_candidate_view(request):
    # Handle file upload
    if request.method == 'POST':
        form = CandidateForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect('/')
    else:
        form = CandidateForm()  # An empty, unbound form

    # Render list page with the documents and the form
    return render(
        request,
        'candidates/index.html',
        {'form': form}
    )

