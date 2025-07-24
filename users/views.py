# users/views.py
# from django.shortcuts import render # This import is not needed for DRF APIViews
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny # For registration, allow anyone to access
from rest_framework_simplejwt.views import TokenObtainPairView # Base class for login
from .serializers import UserSerializer, CustomTokenObtainPairSerializer # Import your serializers

# View for User Registration
class UserRegistrationView(APIView):
    permission_classes = [AllowAny] # Anyone can register

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # This calls the create method in UserSerializer
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Custom View for JWT TokenObtainPairView (if you want to use your CustomTokenObtainPairSerializer)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer