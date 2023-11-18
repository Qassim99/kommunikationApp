from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from  django.utils.translation import gettext_lazy as _

# Register your models here.

class UserAdminConfig(UserAdmin):
    model = User
    search_fields = ('username', 'last_name', 'email', 'birthday', 'phone_number')
    list_filter = ('last_name','is_active', 'is_eighteen', 'is_staff')
    ordering = ('-date_joined',)
    list_display = ('username', 'first_name','last_name', 'email', 'phone_number',
                    'is_eighteen', 'is_active')
    # fieldsets = (
    #     (None, {'fields': ('username', 'first_name','last_name', 'email', 'phone_number',)}),
    #     ('Permissions', {'fields': ('is_staff', 'is_active')}),
    # )
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", "phone_number", "birthday")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_eighteen",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ( 'username', 'first_name', 'last_name', 'email', 'birthday','phone_number','password1', 'password2', 'is_staff')}
         ),
    )

admin.site.register(User, UserAdminConfig)