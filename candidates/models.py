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
    score = models.IntegerField(null=True)
    # blank=True => default value to 0, that's why we use null; it makes it  clear that the score is unknown
    owner = models.ForeignKey(
        User, related_name="candidates", on_delete=models.CASCADE, null=True)

    def compute_score(self):
        if self.score is None:
            self.score = 100
        return 200

    def __str__(self):

        return "{}: Candidate named {}".format(self.id, self.name)


class Keywords(models.Model):
    id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=200)
    weight = models.IntegerField(null=True)


class Job(models.Model):
    id = models.AutoField(primary_key=True)
    job_description = models.FileField(blank=True, null=True, default=None, upload_to='./media/job_description')
    keywords = models.ForeignKey(
        Keywords, related_name="keywords", on_delete=models.CASCADE, null=True)




