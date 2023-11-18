from django.urls import path
from .views import GroupChatRealtimeAPIView, GroupCreateAPIView, GroupDetialAPIView, GroupListAPIView

urlpatterns = [
    path("", GroupListAPIView.as_view(), name= "group-list"),
    path("group-create", GroupCreateAPIView.as_view(), name= "group-create"),
    path("group-detail-update-delete-retrieve/<int:pk>/", GroupDetialAPIView.as_view(), name= "group-detail"),
    path('group-chat-realtime/<int:pk>/', GroupChatRealtimeAPIView.as_view(), name='group-chat-realtime'),
]