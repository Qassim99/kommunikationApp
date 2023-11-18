from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from ..models import User
from django.core.mail import send_mail
from django.conf import settings
from .serializers import (
    # LoginSerializer,
    PasswordResetSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
)


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    # def post(self, request, *args, **kwargs):
    #     response = super().post(request, *args, **kwargs)
    #     refresh = response.data['refresh']
    #     access = response.data['access']

    #     return Response({
    #         'access_token': access,
    #         'refresh_token': refresh,
    #     }, status=response.status_code)

class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({'detail': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'Logout successful.'}, status=status.HTTP_200_OK)
    
class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            return Response({'detail': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({'access_token': access_token}, status=status.HTTP_200_OK)

class PasswordResetView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user =User.objects.get(email == email)
        except User.DoesNotExist:
            return Response (
                {'detail': 'User not found'},
                status= status.HTTP_404_NOT_FOUND
            )
        refresh = RefreshToken.for_user(user)
        reset_token = str(refresh.access_token)

        
        reset_url = f'{settings.FRONTEND_URL}/password-reset/{reset_token}/'

        # Compose and send the reset email
        subject = 'Password Reset'
        message = f'Click the following link to reset your password: {reset_url}'
        # from_email = settings.DEFAULT_FROM_EMAIL
        from_email = 'sefaldeen@stud.uni-hannover.de'
        # to_email = user.email
        to_email = 'xxforex77@gmail.com'

        send_mail(subject, message, from_email, [to_email])

        return Response({'detail': 'Password reset email sent successfully.'}, status=status.HTTP_200_OK)

