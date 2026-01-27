import requests
import sys
import random
from random_words import words
sys.stdout.reconfigure(encoding='utf-8')


def param(language="en", category=None):
    statement = ""
    if language == "en" and category == None:
        for word in range(0,30):
            statement += random.choice(words) + " "
        return statement

    url = "https://random-words-api.kushcreates.com/api"
    params = {
        "language": language,
        "category": category,
        'words': 30
    }
    response = requests.get(url, params=params, timeout=5)
    response.raise_for_status()
    for word in response.json():
        statement+=word.get("word") + " "
    return statement

print(param())