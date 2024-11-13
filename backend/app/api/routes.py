from fastapi import APIRouter, HTTPException
from app.models.request_models import StoryRequest, StoryResponse
from app.services.story_generator import StoryGenerator
from app.services.story_refinement import clean_text, refine_story
import logging

# Create the router instance
router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate_story", response_model=StoryResponse)
async def generate_story(request: StoryRequest):
    try:
        # Initialize generator and generate initial story
        generator = StoryGenerator()
        initial_story = generator.generate_story(
            request.prompt,
            request.max_length,
            request.temperature
        )
        
        # Clean the initial story
        cleaned_story = clean_text(initial_story)
        
        try:
            # Try to get the refined story
            final_story = await refine_story(cleaned_story)
        except Exception as e:
            logger.error(f"Refinement failed: {str(e)}")
            final_story = cleaned_story  # Use cleaned story if refinement fails
        
        return StoryResponse(story=final_story)
        
    except Exception as e:
        logger.error(f"Story generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Story generation failed: {str(e)}"
        )
