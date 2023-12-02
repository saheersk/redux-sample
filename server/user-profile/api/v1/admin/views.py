from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from .serializers import LoginAdminSerializer, AdminUserSerializer, AdminRegisterSerializer, AdminUpdateSerializer
from user.models import User


@permission_classes([IsAuthenticated])
class AdminView(APIView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({'message': 'Admin Only data', "access": False}, status=status.HTTP_400_BAD_REQUEST)
        
        users = User.objects.all().order_by('id')

        search_query = request.query_params.get('search', '')

        if search_query:
            users = users.filter(
                Q(username__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(phone_number__icontains=search_query)
            )

        serializer = AdminUserSerializer(users, many=True, context={'request': request})

        return Response({
            'users': serializer.data
        }, status=status.HTTP_200_OK)
    

@permission_classes([IsAuthenticated])
class AdminUser(APIView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({'message': 'Admin Only data', "access": False}, status=status.HTTP_400_BAD_REQUEST)
        
        pk = self.kwargs.get('pk')
        
        try:
            user = User.objects.get(id=pk)
            serializer = AdminUserSerializer(user)
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    
    def put(self, request, *args, **kwargs):

        if not request.user.is_superuser:
            return Response({'message': 'Admin Only data', "access": False}, status=status.HTTP_400_BAD_REQUEST)
        
        pk = self.kwargs.get('pk')

        user = get_object_or_404(User, id=pk)
        serializer = AdminUpdateSerializer(user, data=request.data)

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

    def delete(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({'message': 'Admin Only data', "access": False}, status=status.HTTP_400_BAD_REQUEST)
        pk = self.kwargs.get('pk')

        try:
            user = User.objects.get(id=pk)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

@permission_classes([IsAuthenticated])
class AdminUserAdd(APIView):
    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({'message': 'Admin Only data', "access": False}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data
        serializer = AdminRegisterSerializer(data = data)

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

# @permission_classes([AllowAny])
# class AdminLoginView(APIView):

#     def post(self, request):
#         data = request.data
#         serializer = LoginAdminSerializer(data=data)

#         if not serializer.is_valid():
#             return Response({
#                 'status': False,
#                 'message': serializer.errors
#             },status = status.HTTP_400_BAD_REQUEST)

#         user = authenticate(request, username=serializer.data['username'], password=serializer.data['password'])

#         if not user:
#             return Response({
#                 'status': False,
#                 'message': serializer.errors
#             },status = status.HTTP_400_BAD_REQUEST)
            
#         login(request, user)
#         refresh = RefreshToken.for_user(user)

#         return Response({
#                 'status': True,
#                 'message': 'user logged in successfully',
#                 'token': {
#                     'refresh': str(refresh),
#                     'access': str(refresh.access_token)
#                 },
#                 'username': request.user.username,
#                 "user_id": request.user.id,
#                 "is_admin": request.user.is_superuser
#             }, status = status.HTTP_200_OK)