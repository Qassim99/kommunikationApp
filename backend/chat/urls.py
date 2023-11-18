from django.urls import path
from .views import *

urlpatterns = [
    path("", GroupListView.as_view(), name='home'),
    path("group/<int:pk>/room/", GroupDetialView.as_view(), name="group_detail"),
    path("group/<int:pk>/edit/", GroupUpdateView.as_view(), name="group_edit"),
    path("group/<int:pk>/delete/", GroupDeleteView.as_view(), name="group_delete"),
    path("group/new/", GroupCreateView.as_view(), name="group_new"),
    path('group/<int:pk>/', GroupChatView.as_view() , name='room'), 
    path('chat/group/<int:pk>/', GroupChatRealtimeView.as_view() , name='chatPage'),
]