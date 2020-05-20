from django.urls import path
from rest_framework import routers
from .views import CandidateViewSet, create_candidate_view

router = routers.DefaultRouter()
router.register('candidates', CandidateViewSet, 'candidates')
# router.register('<The URL prefix>', <The view set class>, '<The URL name>')
# We use three arguments to the register() method, but the third argument is not required.

urlpatterns = [
    path('candidate/files/', create_candidate_view, name='upload_candidate'),
]

urlpatterns += router.urls
