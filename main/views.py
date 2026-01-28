from django.shortcuts import render, redirect
from .models import *
from django.contrib.auth import login,logout, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .random_api import param

def leaderboards(request):
    time = request.GET.get('time')
    if time == 'all' or time == None: 
        scores = Score.objects.all()
    elif time == '15':
        scores = Score.objects.filter(time=15)
    elif time == '30':
        scores = Score.objects.filter(time=30)
    elif time == '60':
        scores = Score.objects.filter(time=60)
    return render(request, 'main/leaderboards.html',{"scores":scores})

def home(request):
    return render(request, 'main/home.html')

def auth(request):
    return render(request, 'main/auth.html')

@csrf_exempt
def authentication(request):
    if request.method != "POST":
        return JsonResponse({"error":"only POST requests are allowed"}, status=400)
    try:
        data = json.loads(request.body)
        if data.get("type") == "login":
                username = data.get("username")
                password = data.get("password")
                user = authenticate(request, username=username, password=password)
                if user:
                    login(request,user)
                    return JsonResponse({"message":"login successful"}, status=200)
                else:
                    return JsonResponse({"error":"user not found"}, status=404)
        elif data.get("type") == "signUp":
            username = data.get("username") 
            email = data.get("email")
            password = data.get("password")
            user = User(username=username, email=email)
            user.set_password(password)
            user.full_clean()
            user.save()
            return JsonResponse({"message":"sign up successful"}, status=200)
    except ValidationError as e:
        return JsonResponse({"errors": e.message_dict}, status=400)
    except IntegrityError as e:
        return JsonResponse({"error":e}, status=400)
    except Exception as e:
        return JsonResponse({"error": e}, status=500)
    
def profile(request):
    pass    
def statistics(request):
    return render(request, "main/stat.html")                

def logout_view(request):
    logout(request)
    return redirect('auth')

def statement(request):
    if request.method != "GET":
        return JsonResponse({"error": "only get requests are allowed"}, status=400)
    try:
        language = request.GET.get("language")
        category = request.GET.get("category")
        if language == None and category == None:
            statement = param()
        elif language == None:
            statement = param(category=category)
        elif category == None:
            statement = param(language=language)
        print(language, category)
        print(statement)
        return JsonResponse({"statement": statement}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

