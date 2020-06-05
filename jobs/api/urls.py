from django.urls import path
from rest_framework import routers
from .views import KeywordsViewSet, JobViewSet

router = routers.DefaultRouter()
router.register('keywords', KeywordsViewSet, 'keywords')
router.register('job', JobViewSet, 'job')
urlpatterns = router.urls
