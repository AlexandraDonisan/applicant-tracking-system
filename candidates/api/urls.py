from rest_framework import routers
from .views import CandidateViewSet

router = routers.DefaultRouter()
router.register('candidates', CandidateViewSet, 'candidates')
# router.register('<The URL prefix>', <The view set class>, '<The URL name>')
# We use three arguments to the register() method, but the third argument is not required.

urlpatterns = router.urls
