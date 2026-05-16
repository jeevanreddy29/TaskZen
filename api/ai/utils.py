import os
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Global variables for models (lazy initialization)
_gemini_model = None
_openai_client = None

def get_gemini_model():
    global _gemini_model
    if _gemini_model is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None
        genai.configure(api_key=api_key)
        _gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    return _gemini_model

def get_openai_client():
    global _openai_client
    if _openai_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None
        _openai_client = OpenAI(api_key=api_key)
    return _openai_client

async def generate_completion(prompt: str, provider: str = "gemini"):
    """
    Generates a completion using either Gemini or OpenAI.
    """
    if provider == "gemini":
        model = get_gemini_model()
        if not model:
            return "Gemini Error: Missing API Key"
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Gemini Error: {str(e)}"
    
    elif provider == "openai":
        client = get_openai_client()
        if not client:
            return "OpenAI Error: Missing API Key"
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"OpenAI Error: {str(e)}"
    
    return "Invalid provider"

async def summarize_text(text: str):
    prompt = f"Please summarize the following text in a concise manner, focusing on key points:\n\n{text}"
    return await generate_completion(prompt)

async def extract_tasks(text: str):
    prompt = f"Extract actionable tasks from the following text. Return them as a bulleted list:\n\n{text}"
    return await generate_completion(prompt)
