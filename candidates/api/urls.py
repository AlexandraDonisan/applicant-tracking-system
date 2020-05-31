from django.urls import path
from rest_framework import routers
from .views import CandidateViewSet, KeywordsViewSet, JobViewSet, compute_score_view

router = routers.DefaultRouter()
router.register('candidates', CandidateViewSet, 'candidates')
router.register('keywords', KeywordsViewSet, 'keywords')
router.register('job', JobViewSet, 'job')

# router.register('<The URL prefix>', <The view set class>, '<The URL name>')
# We use three arguments to the register() method, but the third argument is not required.

urlpatterns = [
    path('candidate/compute_score/', compute_score_view, name='compute_score'),
]

urlpatterns += router.urls
