from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)

from api.v1.auth.views import Login, Register, ProfileView


urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
    path("login/", Login.as_view(), name="login"),
    path("register/", Register.as_view(), name="register"),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
