import os
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# Configure OpenAI
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_completion(prompt: str, provider: str = "gemini"):
    """
    Generates a completion using either Gemini or OpenAI.
    """
    if provider == "gemini":
        try:
            response = gemini_model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Gemini Error: {str(e)}"
    
    elif provider == "openai":
        try:
            response = openai_client.chat.completions.create(
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
