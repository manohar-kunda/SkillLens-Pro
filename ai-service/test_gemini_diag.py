import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:10]}...")

client = genai.Client(api_key=api_key)

MODEL_FALLBACKS = [
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-flash-latest'
]

for model_name in MODEL_FALLBACKS:
    try:
        print(f"Testing {model_name}...")
        response = client.models.generate_content(
            model=model_name,
            contents="Say 'Connected' if you are working."
        )
        print(f"Result {model_name}: {response.text}")
    except Exception as e:
        print(f"Error {model_name}: {str(e)}")
