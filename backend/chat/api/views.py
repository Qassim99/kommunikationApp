
from rest_framework.generics import (
    ListAPIView, 
    RetrieveUpdateDestroyAPIView, 
    CreateAPIView, 
    get_object_or_404,
)
from rest_framework.views import APIView
from .serializers import GroupSerializer, MessageSerializer
from rest_framework import permissions, status
from rest_framework.response import Response 
from ..models import Group, Message
from .permissions import IsMemberOrAdmin
from rest_framework.permissions import BasePermission, IsAuthenticated


class IsMemberOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        print(request.user)
        return request.user in obj.members.all() or request.user == obj.admin

class GroupListAPIView(ListAPIView):
    permission_classes =[IsAuthenticated]
    def get_queryset(self):
        # Filter groups where the user is either an admin or a member
        user = self.request.user
        queryset = Group.objects.filter(members=user) | Group.objects.filter(admin=user)

        # Use Python to filter out duplicate entries based on the group's primary key
        seen_ids = set()
        unique_queryset = []
        for group in queryset:
            if group.pk not in seen_ids:
                seen_ids.add(group.pk)
                unique_queryset.append(group)

        return unique_queryset
    serializer_class = GroupSerializer


class GroupDetialAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Group.objects.all()
    serializer_class = GroupSerializer



class GroupCreateAPIView(CreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer  # Use the default serializer
    permission_classes = [permissions.IsAuthenticated]  # You can customize permissions as needed

    def perform_create(self, serializer):
        # Set the admin to the currently authenticated user
        serializer.save(admin=self.request.user)

    def create(self, request, *args, **kwargs):
        # Customize the serializer with specific included_fields
        included_fields = ['name', 'members']
        serializer = self.get_serializer(data=request.data, included_fields=included_fields)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)







class GroupChatRealtimeAPIView(APIView):
    # permission_classes = [IsGroupMember]  # Add appropriate permission class

    def get(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        messages = Message.objects.filter(group=group)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    # def post(self, request, pk):
    #     group = get_object_or_404(Group, pk=pk)
    #     content = request.data.get('message_content')
    #     sender = request.user

    #     if request.user.is_authenticated:
    #         message = Message(sender=sender, group=group, content=content)
    #         message.save()
    #         serializer = MessageSerializer(message)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
        # else:
        #     return Response("You must be authenticated to post a message.", status=status.HTTP_403_FORBIDDEN)