from pydantic import BaseModel, Field

class StoryRequest(BaseModel):
    prompt: str
    max_length: int = Field(default=200, ge=1, le=1000)
    temperature: float = Field(default=0.7, ge=0.1, le=1.0)

class StoryResponse(BaseModel):
    story: str