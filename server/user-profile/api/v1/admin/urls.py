from django.urls import path

from api.v1.admin.views import AdminView, AdminUser, AdminUserAdd


urlpatterns = [
    path("users/all/", AdminView.as_view(), name="admin_views"),
    path("user/add/", AdminUserAdd.as_view(), name="admin_add"),
    path("user/<int:pk>/", AdminUser.as_view(), name="admin_user"),
    # path("login/", AdminLoginView.as_view(), name="admin_login"),
]
