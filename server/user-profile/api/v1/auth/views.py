from django.contrib.auth import authenticate, login

from rest_framework.decorators import  permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView, UpdateAPIView

from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer
from user.models import User


@permission_classes([AllowAny])
class Login(APIView):

    def post(self, request):
        data = request.data
        serializer = LoginSerializer(data=data)

        if not serializer.is_valid():
            return Response({
                'status': False,
                'message':"Invalid credentials"
            },status = status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=serializer.data['username'], password=serializer.data['password'])

        if not user:
            return Response({
                'status': False,
                'message': "credentials is Wrong"
            },status = status.HTTP_400_BAD_REQUEST)
            
        login(request, user)
        refresh = RefreshToken.for_user(user)

        return Response({
                'status': True,
                'message': 'user logged in successfully',
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },
                'username': request.user.username,
                "user_id": request.user.id,
                "is_admin": request.user.is_superuser
            }, status = status.HTTP_200_OK)


@permission_classes([AllowAny])
class Register(APIView):

    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data = data)

        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': serializer.errors
            },status = status.HTTP_400_BAD_REQUEST)
        
        serializer.save()

        return Response({
                'status': True,
                'message': 'user created successfully'
            },status = status.HTTP_201_CREATED)
    


class ProfileView(ListAPIView, UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        users = User.objects.get(id=request.user.id)
        serializer = UserProfileSerializer(users, context={ "request": request })
        return Response({
            'users': serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = UserProfileSerializer(user, data=request.data, context={ "request": request })

        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': True,
                'message': 'User profile updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': False,
                'message': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)