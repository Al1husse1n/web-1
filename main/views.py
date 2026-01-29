from django.shortcuts import render, redirect
from .models import *
from django.contrib.auth import login,logout, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .random_api import param

@login_required
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

@login_required
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

@login_required
@csrf_exempt
def statistics(request):
    if request.method != "POST":
        return JsonResponse({"error":"only post requests are allowed"},status=405)
    try:
        current_user = request.user
        data = json.loads(request.body)
        wpm = data.get("wpm")
        accuracy = data.get("accuracy")
        statement = data.get("statement")
        correct_words = data.get("correct_words")
        incorrect_words = data.get("incorrect_words")
        time = data.get("time")
        category = data.get("category")
        language = data.get("language")
        score = Score(
            wpm=wpm,
            accuracy=accuracy,
            statement=statement,
            correct_words=correct_words,
            incorrect_words=incorrect_words,
            time=time,
            user=current_user
        )
        score.full_clean()
        score.save()
        print(score)
        return JsonResponse({"message":"score saved successfully"}, status = 200)
    except ValidationError as e:
        return JsonResponse({"errors":e.message_dict}, status=400)
    except IntegrityError as e:
        return JsonResponse({"error":str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
def stat(request):
    wpm = request.GET.get("wpm")
    accuracy = request.GET.get("accuracy")
    category = request.GET.get("category")
    language = request.GET.get("language")
    statement_length = request.GET.get("statement_length")
    correct_words = request.GET.get("correct_words")
    incorrect_words = request.GET.get("incorrect_words")
    time = request.GET.get("time")
    return render(request, "main/stat.html", {
            "wpm":int(wpm),
            "accuracy":int(accuracy),
            "category":category,
            "language":language,
            "characters":int(statement_length), 
            "correct_words":int(correct_words),
            "incorrect_words":int(incorrect_words),
            "time":int(float(time))
        })

@login_required
def logout_view(request):
    logout(request)
    return redirect('auth')

@login_required
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

