# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model # Use get_user_model for flexibility
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Get the currently active User model (handles both default and custom user models)
User = get_user_model()

# Serializer for User Registration
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False)  # Phone field from frontend
    location = serializers.CharField(write_only=True, required=False) # Location field from frontend

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone', 'location'] # Include all fields

    def create(self, validated_data):
        # Extract phone and location before creating the user instance
        # These are popped so they aren't directly passed to User.objects.create_user
        phone = validated_data.pop('phone', None)
        location = validated_data.pop('location', None)

        # Create the user using Django's built-in method (handles password hashing)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # Use .get for email as it's optional by default on User
            password=validated_data['password']
        )

        # IMPORTANT: Now, save phone and location to the CustomUser instance
        if phone:
            user.phone_number = phone # Assuming you named the field 'phone_number' in CustomUser
        if location:
            user.location = location
        user.save() # Save the user instance to persist phone_number and location

        return user

# Custom Serializer for JWT TokenObtainPairView (optional, but good for adding claims)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the token
        token['email'] = user.email
        # If you have a CustomUser model with phone_number/location fields:
        if hasattr(user, 'phone_number'):
            token['phone'] = user.phone_number
        if hasattr(user, 'location'):
            token['location'] = user.location
        return token