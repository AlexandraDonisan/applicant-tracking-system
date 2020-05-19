from django.contrib.auth.models import User
from django.db import models
import os


def get_image_path(instance, filename):
    return os.path.join('photos', str(instance.id), filename)


class Candidate(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=200, unique=True)
    hello_message = models.CharField(max_length=200, blank=True)
    application_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    cv = models.FileField(blank=True, null=True, default=None)
    profile_image = models.ImageField(upload_to=get_image_path, blank=True, null=True)
    owner = models.ForeignKey(
        User, related_name="candidates", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return "{}: Candidate named {}".format(self.id, self.name)


