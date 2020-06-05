from django.db import models


class Job(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    default_score = models.IntegerField(default=30, blank=True)
    job_description = models.FileField(blank=True, null=True, default=None, upload_to='./media/job_description')

    def __str__(self):
        return "{}: Job designation {}".format(self.id, self.name)


class Keywords(models.Model):
    id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=200)
    weight = models.IntegerField(null=True)
    job = models.ForeignKey(
        Job, related_name="job", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return "{}: Keyword {} having {} weight".format(self.id, self.word, self.weight)