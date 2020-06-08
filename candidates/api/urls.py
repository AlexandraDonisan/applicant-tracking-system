from django.urls import path
from rest_framework import routers
from .views import CandidateViewSet, \
    compute_score_view, get_similar_cvs_view, summarize_all_cvs, get_matching_skills, get_missing_skills, \
    get_candidate_by_owner

router = routers.DefaultRouter()
router.register('candidates', CandidateViewSet, 'candidates')

# router.register('<The URL prefix>', <The view set class>, '<The URL name>')
# We use three arguments to the register() method, but the third argument is not required.

urlpatterns = [
    path('candidate/compute_score/', compute_score_view, name='compute_score'),
    path('candidate/get_similar_cvs/', get_similar_cvs_view, name='compute_score'),
    path('candidate/summarize_cvs/', summarize_all_cvs, name='summarize_all_cvs'),
    path('candidate/matching_skills/<int:id>/', get_matching_skills, name='get_matching_skills'),
    path('candidate/missing_skills/<int:id>/', get_missing_skills, name='get_missing_skills'),
    path('candidate/get_by_owner/<int:id>/', get_candidate_by_owner, name='get_by_owner'),

]

urlpatterns += router.urls
