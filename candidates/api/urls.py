from django.urls import path
from rest_framework import routers
from .views import CandidateViewSet, KeywordsViewSet, JobViewSet

router = routers.DefaultRouter()
router.register('candidates', CandidateViewSet, 'candidates')
router.register('keywords', KeywordsViewSet, 'keywords')
router.register('job', JobViewSet, 'job')

# router.register('<The URL prefix>', <The view set class>, '<The URL name>')
# We use three arguments to the register() method, but the third argument is not required.

urlpatterns = [
]

urlpatterns += router.urls
