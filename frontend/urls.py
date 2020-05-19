from django.urls import path

from .views import index, CandidatesDetailView, CreateAPIView

urlpatterns = [
    path('', index),
    path('login', index),
    path('register', index),
    path('new/', CreateAPIView.as_view()),
    path('details/<int:pk>/', CandidatesDetailView.as_view()),
    path('edit/<int:pk>', CandidatesDetailView.as_view()),
    path('delete/<int:pk>', CandidatesDetailView.as_view()),
]