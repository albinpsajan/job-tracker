from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'company',
            'role',
            'status',
            'date_applied',
            'owner',
        ]
        read_only_fields = ['id', 'date_applied', 'owner']