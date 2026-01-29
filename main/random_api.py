import requests
import sys
import random
from .random_words import words
sys.stdout.reconfigure(encoding='utf-8')


def param(language="en", category=None):
    statement = ""
    url = "https://random-words-api.kushcreates.com/api"
    params = {
            "language": language,
            'words': 60
        }
    if language == "en" and category is None:
        for _ in range(60):
            statement += random.choice(words) + " "
        return statement
    elif category is not None:
        params["category"] = category

    response = requests.get(url, params=params, timeout=5)
    response.raise_for_status()
    for word in response.json():
        statement+=word.get("word") + " "
    return statement

