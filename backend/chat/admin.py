from django import forms
from django.contrib import admin
from .models import Group, Message
from account.models import User
# Register your models here.



class GroupAdminForm(forms.ModelForm):
    members = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    class Meta:
        model = Group
        fields = '__all__'

class GroupAdmin(admin.ModelAdmin):
    form = GroupAdminForm

admin.site.register(Group, GroupAdmin)
admin.site.register(Message)