import os
# from google.genai import GenerativeModel, configure
from google import genai
# import google.generativeai as genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()           # loading env variables

# initializing APi key
# configure(api_key=os.getenv("GEMINI_API_KEY"))


# Configure client
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# genai.config(api_key=os.getenv("GEMINI_API_KEY"))

# Only run this block for Gemini Developer API
# client = genai.Client(api_key='GEMINI_API_KEY')
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# client = genai.Client()

# load model
# response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents="Explain how AI works in a few words",
# )
# print(response.text)


# writing a function for accepting paramters.
def gemini_chat_llm(query: str, context: str, prompt:str) -> str:
# def gemini_chat_llm(query: str, context: str) -> str:
  contents = [
    {
      "role" : "user",
      "parts" : [
        {
          "text" : f"Context:\n{context}\n\nQuestion:\n{query}"
        }
      ]
    }
  ]
  
  response = client.models.generate_content(
    # prompt,
    model = "gemini-2.0-flash",
    contents = contents,
    #  config=types.GenerateContentConfig(
    #     thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking    (only supported for 2.5 model)
    # ),
   
  )
  
  return response.text

