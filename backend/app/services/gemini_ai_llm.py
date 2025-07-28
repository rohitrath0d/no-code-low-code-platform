import os
# from google.genai import GenerativeModel, configure
from google import genai
# import google.generativeai as genai
from google.genai import types
from dotenv import load_dotenv
from typing import Optional,  List, Dict


load_dotenv()           # loading env variables

# initializing APi key
# configure(api_key=os.getenv("GEMINI_API_KEY"))


# Configure client
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# genai.config(api_key=os.getenv("GEMINI_API_KEY"))

# Only run this block for Gemini Developer API
# client = genai.Client(api_key='GEMINI_API_KEY')


# client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# client = genai.Client()

# load model
# response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents="Explain how AI works in a few words",
# )
# print(response.text)

# def initialize_gemini(api_key: Optional[str] = None):
#     """Initialize Gemini client with optional API key override"""
#     api_key = api_key or os.getenv('GEMINI_API_KEY')
#     if not api_key:
#         raise ValueError("No Gemini API key provided")
#     genai.configure(api_key=api_key)


# # writing a function for accepting paramters.
# def gemini_chat_llm(
#   query: str,
#   context: str = "",
#   prompt:str = "",
#   model: str="gemini-2.0-flash",
#   api_key: Optional[str] = None) -> str:
# # def gemini_chat_llm(query: str, context: str) -> str:
#   contents = [
#     {
#       "role" : "user",
#       "parts" : [
#         {
#           "text" : f"Context:\n{context}\n\nQuestion:\n{query}"
#         }
#       ]
#     }
#   ]

#   response = client.models.generate_content(
#     # prompt,
#     model = "gemini-2.0-flash",
#     contents = contents,
#     #  config=types.GenerateContentConfig(
#     #     thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking    (only supported for 2.5 model)
#     # ),

#   )

#   return response.text


# def initialize_gemini(api_key: Optional[str] = None):
#     """Initialize Gemini client with optional API key override"""
#     api_key = api_key or os.getenv('GEMINI_API_KEY')
#     if not api_key:
#         raise ValueError("No Gemini API key provided")
#     genai.configure(api_key=api_key)


class GeminiAIClient:
    def __init__(self):
        """Initialize the Gemini AI client"""
        self.client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

    # def gemini_chat_llm(
    def generate_response(
        self,
        query: str,
        context: str = "",
        prompt: str = "",
        # model: str = "gemini-pro",
        model: str = "gemini-2.0-flash",
        api_key: Optional[str] = None,
        chat_history: list = None
    ) -> str:
        """ Generate response using Gemini AI
            Args:
            query: User's question/input
            context: Relevant context for the query
            prompt: System prompt/instructions
            model: Gemini model to use
            api_key: Optional API key override
            chat_history: List of previous messages

            Returns:
            Generated response text
        """
        try:
        # Initialize the model with api key
        # initialize_gemini(api_key)

        # Initialize the model
        # model = genai.GenerativeModel(model)

        # Build conversation history
            history = []
            if chat_history:
                history = [
                    {'role': msg['role'], 'parts': [msg['content']]}
                    for msg in chat_history
                ]

            # Start chat with history
            # chat = model.start_chat(history=history)

            # Construct the full prompt
            full_prompt = f"{prompt}\n\nContext:\n{context}\n\nQuestion:\n{query}"

            # Generate response
            # response = model.generate_content(full_prompt)

            # For chat models, include history in the contents
            if chat_history:
                contents = history + [{'role': 'user', 'parts': [full_prompt]}]
            else:
                contents = [full_prompt]

            # Generate response     -- with recent config updates
            response = self.client.models.generate_content(
                model=model,
                # contents=[full_prompt],
                contents=contents,
                # Additional parameters can be added here
            )

            return response.text

        except Exception as e:
            raise ValueError(f"Gemini AI error: {str(e)}")
            
# Initialize singleton client
gemini_client = GeminiAIClient()
