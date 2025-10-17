from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings


"""class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # No username or extra required fields

    objects = UserManager()

    def __str__(self):
        return self.email


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    username = models.CharField(max_length=100, blank=True)
    phone_no = models.CharField(max_length=20, blank=True)
    country_code = models.CharField(max_length=4, blank=True)

    def __str__(self):
        return f"{self.username}'s Profile"
"""



class UserManager(BaseUserManager):
    def create_user(self, email, password=None, username=None, phone_no=None, **extra_fields):
        if not email:
            raise ValueError("Email field is required")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, phone_no=phone_no, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        """# Create profile automatically
        Profile.objects.create(user=user, username=username, phone_no=phone_no)"""

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    phone_no = models.CharField(max_length=15, blank=True)
    country_code = models.CharField(max_length=4, blank=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.email



class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    username = models.CharField(max_length=150, blank=True)
    phone_no = models.CharField(max_length=15, blank=True)
    country_code = models.CharField(max_length=4, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    #license details
    license_number = models.CharField(max_length=50, blank=True)
    issue_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    issuing_authority = models.CharField(max_length=100, blank=True)
    license_class = models.CharField(max_length=50, blank=True)
    front_image = models.ImageField(upload_to='licenses/', blank=True, null=True)
    back_image = models.ImageField(upload_to='licenses/', blank=True, null=True)

    def __str__(self):
        return f"{self.username or self.user.email}'s Profile"