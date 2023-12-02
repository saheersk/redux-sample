import re

from rest_framework import serializers

from django.core.validators import validate_email
from user.models import User


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField()
    phone_number = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match.")

        data.pop('confirm_password')

        if not data.get('first_name'):
            raise serializers.ValidationError("First name is required.")
        if not data.get('last_name'):
            raise serializers.ValidationError("Last name is required.")
        if not data.get('username'):
            raise serializers.ValidationError("Username is required.")
        if User.objects.filter(username=data.get('username')).exists():
            raise serializers.ValidationError("Username is already taken.")

        phone_number = data.get('phone_number')

        phone_regex = re.compile(r'^\+91\d{10}$')
        if not phone_regex.match(phone_number):
            raise serializers.ValidationError("Invalid phone number format. Please enter a valid Indian phone number.")

        if not phone_number:
            raise serializers.ValidationError("Phone number is required.")
        if User.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError("Phone number is already registered.")

        return data


    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number']
        )
        user.set_password(validated_data['password'])
        user.save()
        return validated_data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username:
            raise serializers.ValidationError("Username is required.")
        if not password:
            raise serializers.ValidationError("Password is required.")

        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User not Found.")

        return data
    

class UserProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['image', 'username', 'email', 'first_name', 'last_name']

    def get_image(self, instance):
        request = self.context.get('request')
        if instance.image:
            return request.build_absolute_uri(instance.image.url)
        return None

    def validate_image(self, value):
        if not value:
            raise serializers.ValidationError("Image is required.")
        return value

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        return value

    def validate_email(self, value):
        validate_email(value)
        return value

    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("First name must contain only alphabetical characters.")
        return value