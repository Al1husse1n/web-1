from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
class User(AbstractUser):
    email = models.EmailField()

class Score(models.Model):
    wpm = models.IntegerField()
    accuracy = models.FloatField()
    statement = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    correct_words = models.IntegerField()
    incorrect_words = models.IntegerField()
    time = models.IntegerField()
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="scores")

    class Meta:
        ordering = ['wpm', 'accuracy']
    


