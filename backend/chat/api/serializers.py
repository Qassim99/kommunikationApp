from rest_framework import serializers
from ..models import Message, Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        # Get the list of fields to include, or include all fields if not specified
        included_fields = kwargs.pop('included_fields', None)

        super(GroupSerializer, self).__init__(*args, **kwargs)

        if included_fields is not None:
            # Filter the fields to include based on the provided list
            allowed = set(included_fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
                
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"