import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

models_to_test = [
    'gemini-1.5-flash',
    'gemini-flash-latest',
    'gemini-1.5-flash-8b',
    'gemini-2.0-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-1.5-pro',
    'gemini-pro-latest'
]

print("Starting model quota test...")
for model in models_to_test:
    try:
        print(f"Testing {model}...", end=" ", flush=True)
        response = client.models.generate_content(
            model=model,
            contents="Say 'ok'",
            config={'response_mime_type': 'text/plain'}
        )
        print(f"SUCCESS: {response.text.strip()}")
    except Exception as e:
        print(f"FAILED: {str(e)[:100]}...")
