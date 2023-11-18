from rest_framework.permissions import BasePermission
from ..models import Group

class IsMemberOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        print(request.user)
        return request.user in obj.members.all() or request.user == obj.admin