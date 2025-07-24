# ecommerce/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView # Keep this as it's not customized
from users.views import UserRegistrationView, CustomTokenObtainPairView # Import your custom views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('store.urls')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # NEW: Use your custom view here
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', UserRegistrationView.as_view(), name='register'),
]