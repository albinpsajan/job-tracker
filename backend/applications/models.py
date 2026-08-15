from django.conf import settings
from django.db import models


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'Applied', 'Applied'
        INTERVIEWING = 'Interviewing', 'Interviewing'
        REJECTED = 'Rejected', 'Rejected'

    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED,
    )
    date_applied = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
    )

    def __str__(self):
        return f'{self.company} - {self.role}'