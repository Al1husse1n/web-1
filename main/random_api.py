import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

def param(language="en", category=None):
    url = "https://random-words-api.kushcreates.com/api"
    params = {
        "language": language,
        "category": category,
        'words': 30
    }
    response = requests.get(url, params=params, timeout=5)
    response.raise_for_status()
    statement = ""
    for word in response.json():
        statement+=word.get("word") + " "
    return statement

print(param())