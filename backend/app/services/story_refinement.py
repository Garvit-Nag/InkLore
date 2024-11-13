import re
import unicodedata
import google.generativeai as genai
from fastapi import HTTPException
from app.core.config import settings

# Configure Gemini API
genai.configure(api_key=settings.GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

def clean_text(story: str) -> str:
    """Clean and normalize the generated text"""
    cleaned_story = unicodedata.normalize("NFKD", story)
    cleaned_story = re.sub(r'[\n\\]+', ' ', cleaned_story)
    cleaned_story = re.sub(r'\s+', ' ', cleaned_story)
    cleaned_story = (
        cleaned_story.replace("â€œ", "\"").replace("â€", "\"").replace("â€™", "'")
                     .replace("â€TMs", "'s").replace("â€œ", "\"").replace("Ó", "O")
                     .replace("â", "").replace("�", "")
    )
    cleaned_story = cleaned_story.replace("\\", "")
    return cleaned_story.strip()

async def refine_story(story: str) -> str:
    """Refine the story using the Gemini API with two-step refinement"""
    try:
        # First refinement
        first_prompt = f"""
        Refine the following story to make it coherent, grammatically correct, and fluent. 
        Maintain the original plot and ending, but enhance readability, fluency, and consistency:

        {story}
        """
        
        first_response = gemini_model.generate_content(first_prompt)
        first_refined = first_response.text if hasattr(first_response, 'text') else str(first_response)
        
        # Second refinement for final polishing
        final_prompt = f"""
        Please perform a final polish on this story to ensure perfect coherence, 
        flow, and narrative structure while maintaining the essence of the story:

        {first_refined}
        """
        
        final_response = gemini_model.generate_content(final_prompt)
        final_refined = final_response.text if hasattr(final_response, 'text') else str(final_response)
        
        return final_refined if final_refined else "No refined story generated."
    
    except Exception as e:
        print(f"Error in story refinement: {str(e)}")
        return story  # Return original story if refinement fails