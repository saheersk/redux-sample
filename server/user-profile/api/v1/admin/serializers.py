import re

from rest_framework import serializers

from user.models import User


class LoginAdminSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username:
            raise serializers.ValidationError("Username is required.")
        if not password:
            raise serializers.ValidationError("Password is required.")
        
        if User.objects.filter(username=username, is_superuser=False).exists():
            raise serializers.ValidationError("User not Admin.")

        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User not Found.")

        return data


class AdminUserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'image', 'username', 'email', "phone_number", 'first_name', 'last_name', 'is_superuser']

    def get_image(self, instance):
        request = self.context.get('request')
        if instance.image:
            return request.build_absolute_uri(instance.image.url)
        return None


class AdminRegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField() 
    password = serializers.CharField()
    phone_number = serializers.CharField()
    confirm_password = serializers.CharField()
    is_superuser = serializers.BooleanField(default=False)

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

        if not data.get('email'):
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError("Email is already registered.")

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
            email=validated_data['email'],  # Include email in the create method
            phone_number=validated_data['phone_number'],
            is_superuser=validated_data['is_superuser']
        )
        user.set_password(validated_data['password'])
        user.save()
        return validated_data


class AdminUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    username = serializers.CharField(required=False)
    email = serializers.EmailField()  
    phone_number = serializers.CharField(required=False)
    image = serializers.ImageField(required=False)
    is_superuser = serializers.BooleanField(required=False)

    def validate(self, data):
        if not data.get('first_name'):
            raise serializers.ValidationError("First name is required.")
        if not data.get('last_name'):
            raise serializers.ValidationError("Last name is required.")
        
        phone_number = data.get('phone_number')

        phone_regex = re.compile(r'^\+91\d{10}$')
        if not phone_regex.match(phone_number):
            raise serializers.ValidationError("Invalid phone number format. Please enter a valid Indian phone number.")
        
        if not phone_number:
            raise serializers.ValidationError("Phone number is required.")

        return data

    def update(self, instance, validated_data):
        new_username = validated_data.get('username')
        if new_username and new_username != instance.username and User.objects.filter(username=new_username).exists():
            raise serializers.ValidationError("Username is already taken.")

        new_phone_number = validated_data.get('phone_number')
        if new_phone_number and new_phone_number != instance.phone_number and User.objects.filter(phone_number=new_phone_number).exists():
            raise serializers.ValidationError("Phone number is already registered.")

        if 'image' in validated_data:
            instance.image = validated_data['image']

        if 'is_superuser' in validated_data:
            instance.is_superuser = bool(validated_data['is_superuser'])

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.email = validated_data.get('email', instance.email)

        instance.save()

        return instance



