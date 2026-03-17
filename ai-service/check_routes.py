import requests

url = "http://127.0.0.1:8001/openapi.json"
try:
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        paths = data.get("paths", {}).keys()
        print("Registered Paths:")
        for path in paths:
            print(f" - {path}")
    else:
        print(f"Failed to get openapi.json. Status: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
