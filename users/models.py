from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    A custom user model that extends Django's AbstractUser.
    This allows us to add custom fields like phone_number and location
    directly to the User model.
    """
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        unique=True, # Ensure phone numbers are unique if desired
        help_text='User\'s phone number'
    )
    location = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='User\'s delivery location or area'
    )

    # You can also change the USERNAME_FIELD if you want to log in with email
    # instead of username. If you do this, ensure 'username' is in REQUIRED_FIELDS.
    # For example, to log in with email:
    # email = models.EmailField('email address', unique=True)
    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username'] # 'username' (which would be distinct from 'email' for login)

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        # Add db_table if you want to explicitly name the table
        # db_table = 'custom_users'

    def __str__(self):
        # This is what appears in the Django admin for a user object
        if self.email:
            return self.email
        return self.username