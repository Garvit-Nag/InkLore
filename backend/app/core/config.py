import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Story Generator API"
    MODEL_PATH: str = "best_model.pt"
    GOOGLE_API_KEY: str = os.getenv('GEMINI_API_KEY')
    
    if not GOOGLE_API_KEY:
        raise ValueError("Gemini API Key is not set in the environment variable GEMINI_API_KEY")

settings = Settings()
