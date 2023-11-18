from django.dispatch import receiver
from django.utils import timezone
from django.db import models
from  django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db.models.signals import post_save


# Create your models here.
class CustomAccountManager(BaseUserManager):

    def create_superuser(self, username, first_name, last_name, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user( username, first_name, last_name, email, password, **extra_fields)

    def create_user(self, username, first_name, last_name, email, password, **extra_fields):

        if not email:
            raise ValueError(_('You must provide an email address'))
        if not username:
            raise ValueError("The given username must be set")
        email = self.normalize_email(email)
        user = self.model( username=username, first_name=first_name,
                            last_name= last_name, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

class User(AbstractBaseUser, PermissionsMixin):
    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    email = models.EmailField(_("email address"), blank=True, unique=True)
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    phone_number = models.CharField(max_length=20)
    birthday = models.DateField()
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    is_eighteen = models.BooleanField(
        _("Is Eighteen"),
        default=False,
        help_text=_("Check this box if the user is eighteen years old."),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = CustomAccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone_number', 'birthday']

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
    
    def get_short_name(self):
        return self.first_name
    
    def get_full_name(self):
        return f'{self.first_name}" "{self.last_name}'

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        today = timezone.now().date()
        age = (today - self.birthday).days // 365  # Calculate age in years

        if age >= 18:
            self.is_eighteen = True
        else:
            self.is_eighteen = False

        super().save(*args, **kwargs)



# class UserDevice(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     device_id = models.CharField(max_length=100)
#     end_to_end_encryption_key = models.CharField(max_length=256)

#     def __str__(self):
#         return f'{self.user.username} - Device'