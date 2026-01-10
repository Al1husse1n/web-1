from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

admin.site.register(Score)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

