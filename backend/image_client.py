import os
import requests
import urllib.parse
import logging
from typing import Optional

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def generate_image(scene_description: str) -> str:
    """
    Generate an image for a comic scene using optimized fast generation
    """
    
    # Use Pollinations for ultra-fast generation
    logger.info("Using optimized fast generation")
    return generate_pollinations_image(scene_description)

async def try_huggingface_generation(scene_description: str) -> Optional[str]:
    """
    Try to generate image using HuggingFace Inference API
    """
    hf_token = os.getenv("HUGGINGFACE_API_KEY")
    
    if not hf_token:
        logger.warning("HUGGINGFACE_API_KEY not found, skipping HuggingFace generation")
        return None
    
    # Enhance the prompt for comic book style
    enhanced_prompt = enhance_prompt_for_comics(scene_description)
    
    api_url = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    payload = {
        "inputs": enhanced_prompt,
        "parameters": {
            "negative_prompt": "blurry, low quality, distorted, ugly, bad anatomy",
            "num_inference_steps": 20,
            "guidance_scale": 7.5
        }
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            # HuggingFace returns the image directly, we'd need to upload it somewhere
            # For now, return a placeholder indicating HF generation was attempted
            logger.info("HuggingFace generation successful")
            # In a real implementation, you'd upload the image bytes to a cloud storage
            # and return the URL. For this demo, we'll fall back to Pollinations
            return None
        else:
            logger.error(f"HuggingFace API error: {response.status_code} - {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"HuggingFace request failed: {str(e)}")
        return None

def generate_pollinations_image(scene_description: str) -> str:
    """
    Generate image using Pollinations API with ultra-fast settings
    """
    enhanced_prompt = enhance_prompt_for_comics(scene_description)
    
    # URL encode the prompt
    encoded_prompt = urllib.parse.quote(enhanced_prompt)
    
    # Ultra-fast Pollinations settings: smaller size, fastest model, minimal processing
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=200&height=200&model=flux&nologo=true&enhance=false&steps=4&speed=ultra"
    
    logger.info(f"Generated ultra-fast image URL: {image_url}")
    return image_url

def enhance_prompt_for_comics(scene_description: str) -> str:
    """
    Enhance the scene description for fast comic book image generation
    """
    # Simplified prompt for faster generation
    comic_style_prefix = "comic art, vibrant colors, "
    comic_style_suffix = ", illustration"
    
    enhanced = f"{comic_style_prefix}{scene_description}{comic_style_suffix}"
    
    return enhanced 