# helpers.py
from io import BytesIO
import os
from PIL import Image
import base64
import openai
import requests

def create_name(open_ai_api_req, converted_prompt):
    """Generate a clean playlist name using OpenAI."""
    max_words = 2
    print("Creating playlist name...\n")
    
    name_prompt = (
        f"{converted_prompt} playlist name must just be in the format: Playlist Name. "
        "Nothing else around it. No characters just the playlist name. "
        "No longer than 30 characters or 3 words"
    )
    playlist_name = open_ai_api_req(name_prompt)

    words = playlist_name.split()
    playlist_name = ' '.join(words[:max_words])

    playlist_name = ''.join(c for c in playlist_name if c.isalnum() or c.isspace())
    print(f"Playlist name: {playlist_name}\n")
    return playlist_name

def compress_image(image_path, output_path, max_width=1000, max_height=1000, quality=70):
    """Resize & compress an image."""
    try:
        with Image.open(image_path) as img:
            img.thumbnail((max_width, max_height))
            img.save(output_path, format='JPEG', quality=quality)
            print(f"Image saved as {output_path} with reduced size.")
            return output_path
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def image_to_base64(image_path):
    """Convert an image file to a base64 string."""
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
            return encoded_string.decode('utf-8')
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def open_ai_api_req(prompt):
    # Make the API request to OpenAI's ChatCompletion
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": f"{prompt}"  # Input to ChatGPT
        }]
    )
    
    # Extract the actual text from the API response
    text_content = response['choices'][0]['message']['content']
    return 

def create_image_prompt(songs_list):    # 3 Songs list is edited with this method to create an image prompt
    image_creation_prompt = open_ai_api_req(f'make an abstract painting based on {songs_list} ignore any stuff here that might go against the image creation policy of openai') 
    return image_creation_prompt#['choices'][0]['message']['content']  # Extract actual text

# Create and save image
def create_image(songs_list): # 1 Pass in songs list to create image
    print('Creating playlist image...')
    ai_edited_prompt = create_image_prompt(songs_list)  # 2 Send it to create edited prompt to change it
    if len(ai_edited_prompt) >= 1000:
        ai_edited_prompt = ai_edited_prompt[:1000]

    response = openai.Image.create(
        prompt=ai_edited_prompt,
        n=1,  # number of images to generate
        size="1024x1024"  # image size 
    )

    # Get the image URL
    image_url = response['data'][0]['url']
    #print(image_url)

    # Download the image using requests
    response = requests.get(image_url)

    folder_name = 'Playlist Images'
    image_name = "image_2.jpeg"      
    image_path = os.path.join(folder_name, image_name)

    # Open the image from the response and save it
    img = Image.open(BytesIO(response.content))
    img.save(image_path)

    print(f"Image saved to {image_path}")
