# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User # Django's built-in User model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Serializer for User Registration
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # Password should be write-only

    class Meta:
        model = User
        fields = ['username', 'email', 'password'] # Include fields for registration

    def create(self, validated_data):
        # Override create to correctly hash the password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # Email is optional in default User model
            password=validated_data['password']
        )
        return user

# Custom Serializer for JWT TokenObtainPairView (optional, but good for adding claims)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the token if desired
        token['email'] = user.email
        # You could add other user-related data here, e.g., token['is_staff'] = user.is_staff
        return token