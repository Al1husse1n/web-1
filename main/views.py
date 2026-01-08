from django.shortcuts import render
from .models import *
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
    pass

def login(request):
    return render(request, 'main/login.html')
def sign_up(request):
    pass
def profile(request):
    pass
def statistics(request):
    pass