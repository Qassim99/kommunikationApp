import json
from django.http import HttpResponseForbidden
from django.shortcuts import render
from django.views.generic import (
    ListView,
    DetailView, 
    CreateView, 
    DeleteView, 
    UpdateView, 
    View
)
from .models import *
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404, redirect
# Create your views here.


class GroupListView(ListView):

    model = Group
    template_name= "home.html"


class GroupDetialView(DetailView):

    model = Group
    template_name= "group_detail.html"



class GroupCreateView(CreateView):

    model = Group
    template_name= "group_new.html"
    fields=["name", "members"]
    # form_class = GroupCreateForm  # Use the new form class
    success_url= reverse_lazy("home")
    def form_valid(self, form):
        form.instance.admin = self.request.user  # Assuming the author is the logged-in user
        return super().form_valid(form)


class GroupUpdateView(UpdateView):
    model = Group
    template_name = "group_edit.html"
    fields = ["name", "members"]
    success_url = reverse_lazy("home")

class GroupDeleteView(DeleteView):
    model = Group
    template_name = "group_delete.html"
    success_url = reverse_lazy("home")





class GroupChatView(LoginRequiredMixin,View):
    template_name = 'room.html'

    
    def get(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        messages = Message.objects.filter(group=group)
        return render(request, self.template_name, {'group': group, 'messages': messages})


    def post(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        content = request.POST.get('message_content')
        sender = request.user

        # Check if the user is authenticated before saving the message
        if request.user.is_authenticated:
            message = Message(sender=sender, group=group, content=content)
            message.save()

        return redirect('room', pk=pk)


class GroupChatRealtimeView(LoginRequiredMixin,View):
    template_name = 'chatPage.html'

    
    def get(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        messages = Message.objects.filter(group=group)
        return render(request, self.template_name, {'group': group, 'messages': messages, 'pk': pk})


    def post(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        content = request.POST.get('message_content')
        sender = request.user

        # Check if the user is authenticated before saving the message
        if request.user.is_authenticated:
            message = Message(sender=sender, group=group, content=content)
            message.save()

        return redirect('chatPage', pk=pk)