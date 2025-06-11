import os
import openai
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

async def generate_story(prompt: str) -> str:
    """
    Generate a comic book story panel using GPT-4
    """
    if not os.getenv("AZURE_OPENAI_API_KEY"):
        raise ValueError("AZURE_OPENAI_API_KEY environment variable is not set")
    
    if not os.getenv("AZURE_OPENAI_ENDPOINT"):
        raise ValueError("AZURE_OPENAI_ENDPOINT environment variable is not set")
    
    if not os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"):
        raise ValueError("AZURE_OPENAI_DEPLOYMENT_NAME environment variable is not set")
    
    # Create a detailed prompt for comic book story generation
    system_prompt = """You are a master comic book writer specializing in superhero stories in the style of Marvel and DC Comics. 

Create a single comic panel story segment that is:
- Action-packed and visually dramatic
- 2-3 sentences maximum
- Includes vivid descriptions for visual elements
- Has a clear scene that can be illustrated
- Maintains comic book dialogue style
- Builds suspense and excitement

Format your response as a single paragraph describing the scene and action."""

    user_prompt = f"Create a comic book panel for this story concept: {prompt}"
    
    try:
        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=150,
            temperature=0.8
        )
        
        story = response.choices[0].message.content.strip()
        return story
        
    except Exception as e:
        raise Exception(f"Azure OpenAI API error: {str(e)}")

async def generate_continuation(previous_panels: list, story_theme: str) -> str:
    """
    Generate a continuation of the comic story based on previous panels
    """
    if not os.getenv("AZURE_OPENAI_API_KEY"):
        raise ValueError("AZURE_OPENAI_API_KEY environment variable is not set")
    
    # Create context from previous panels
    context = "\n".join([f"Panel {i+1}: {panel}" for i, panel in enumerate(previous_panels)])
    
    system_prompt = """You are continuing a comic book story. Create the next panel that:
- Follows logically from the previous panels
- Escalates the action or advances the plot
- Maintains the same characters and tone
- Is 2-3 sentences maximum
- Can be easily illustrated

Format as a single paragraph describing the next scene."""
    
    user_prompt = f"Story theme: {story_theme}\n\nPrevious panels:\n{context}\n\nCreate the next panel:"
    
    try:
        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=150,
            temperature=0.8
        )
        
        story = response.choices[0].message.content.strip()
        return story
        
    except Exception as e:
        raise Exception(f"Azure OpenAI API error: {str(e)}") 