from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login, name='login'),
    path('signUp/', views.sign_up, name='signUp'),
    path('profile/', views.profile, name="profile"),
    path('leaderboards/', views.leaderboards, name='leaderboards'),
    path('statistics/', views.statistics, name='statistics')
]