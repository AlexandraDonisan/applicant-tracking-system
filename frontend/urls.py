from django.urls import path

from .views import index, CandidatesDetailView, CreateAPIView, KeywordsDetailView

urlpatterns = [
    path('', index),
    path('login', index),
    path('register', index),
    path('new/', CreateAPIView.as_view()),
    path('details/<int:pk>/', CandidatesDetailView.as_view()),
    path('edit/<int:pk>', CandidatesDetailView.as_view()),
    path('delete/<int:pk>', CandidatesDetailView.as_view()),

    path('new/keywords/', CreateAPIView.as_view()),  # TODO: maybe change to specific create View
    path('new/job/', CreateAPIView.as_view()),
    path('edit/keywords/<int:pk>', KeywordsDetailView.as_view()),
    path('delete/keywords/<int:pk>', KeywordsDetailView.as_view()),
]