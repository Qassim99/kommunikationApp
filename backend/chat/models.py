from django.db import models
from account.models import User
from  django.forms import widgets
# Create your models here.


class Group(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    name = models.CharField(max_length=100)
    description = models.TextField()
    members = models.ManyToManyField(User)


    def __str__(self):
        return self.name
    


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_translated= models.BooleanField(default=False)

    class Meta:
        verbose_name = "message"
        verbose_name_plural = "messages"
    def __str__(self):
        return f'{self.sender.username} - {self.group.name}'



class Translation(models.Model):
    original_message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name='translation')
    translated_message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name='original')

class File(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    file = models.FileField(upload_to='files/')
