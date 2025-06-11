from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai_client import generate_story
from image_client import generate_image

# Load environment variables
load_dotenv()

app = FastAPI(title="ComicQuest API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class StoryRequest(BaseModel):
    prompt: str

class ImageRequest(BaseModel):
    scene: str

class StoryResponse(BaseModel):
    story: str

class ImageResponse(BaseModel):
    image_url: str

@app.get("/")
async def root():
    return {"message": "ComicQuest API is running!"}

@app.post("/generate-story", response_model=StoryResponse)
async def create_story(request: StoryRequest):
    try:
        story = await generate_story(request.prompt)
        return StoryResponse(story=story)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")

@app.post("/generate-image", response_model=ImageResponse)
async def create_image(request: ImageRequest):
    try:
        image_url = await generate_image(request.scene)
        return ImageResponse(image_url=image_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 