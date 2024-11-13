from fastapi import FastAPI
from app.api.routes import router  # Import router directly, not as string

app = FastAPI(title="Story Generator API")

# Include the router
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
