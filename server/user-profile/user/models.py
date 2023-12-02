from django.db import models
from django.contrib.auth.models import AbstractUser

from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    phone_number = PhoneNumberField(unique=True)
    is_blocked = models.BooleanField(default=False)
    image = models.ImageField(upload_to="profile/image", blank=True, null=True)
    is_superuser = models.BooleanField(default=False)

    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def __str__(self):
        return self.username