from rest_framework import viewsets, permissions
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
