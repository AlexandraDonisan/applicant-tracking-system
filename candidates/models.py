from django.contrib.auth.models import User
from django.db import models
import os
import candidates.scanner.train_spacy_ner as cv_tagger


def get_image_path(instance, filename):
    return os.path.join('photos', str(instance.id), filename)


class Candidate(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=200, unique=True)
    hello_message = models.CharField(max_length=200, blank=True)
    application_date = models.DateTimeField(auto_now_add=True)
    cv = models.FileField(blank=True, null=True, default=None)
    profile_image = models.ImageField(upload_to=get_image_path, blank=True, null=True)
    score = models.IntegerField(null=True)
    is_summarized = models.BooleanField(default=False)
    summarized_cv = models.TextField(blank=True, null=True)
    # blank=True => default value to 0, that's why we use null; it makes it  clear that the score is unknown
    owner = models.ForeignKey(
        User, related_name="candidates", on_delete=models.CASCADE, null=True)

    def compute_score(self):
        if self.score is None:
            self.score = 100
        return 200

    def summarize_cv(self):
        if self.cv and self.is_summarized is False:
            cv_name = self.cv.name.split('/')[-1].split('.')[0]

            path = cv_tagger.summarize_text('Alan Walker    alan@walker.com Phone Number: 0757573563', cv_name)
            with open(path, 'r') as F:
                text = F.read()
            return text
        return None

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
