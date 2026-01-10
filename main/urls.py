from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('', views.home, name='home'),
    path('auth/', views.auth, name='auth'),
    path('profile/', views.profile, name="profile"),
    path('leaderboards/', views.leaderboards, name='leaderboards'),
    path('statistics/', views.statistics, name='statistics'),
    path('authenticate/' ,views.authentication, name='autnenticate'),
]   