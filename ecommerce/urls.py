# ecommerce/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView # Keep this as it's not customized
from users.views import UserRegistrationView, CustomTokenObtainPairView # Import your custom views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('store.urls')), # Assuming you have a 'store' app for other API endpoints
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # Uses your custom serializer
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # For refreshing tokens
    path('api/register/', UserRegistrationView.as_view(), name='register'), # For user registration
]