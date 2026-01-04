from django.shortcuts import render
from .models import *
def leaderboards(request):
    scores = Score.objects.all()
    return render(request, 'main/leaderboards.html',{"scores":scores})

def home(request):
    pass
def login(request):
    pass
def sign_up(request):
    pass
def profile(request):
    pass
def statistics(request):
    pass