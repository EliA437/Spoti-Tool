# helpers.py
import os
import re
import time
import base64
import requests
from openai import OpenAI
from PIL import Image
from dotenv import load_dotenv
from .client import sp, sp_oauth  

load_dotenv()
client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))

BANNED_WORDS = os.getenv("BANNED_WORDS", "") 
BANNED_WORDS = [w.strip() for w in BANNED_WORDS.split(",") if w.strip()]

PLAYLIST_IMAGE_FOLDER = 'playlist_images'
os.makedirs(PLAYLIST_IMAGE_FOLDER, exist_ok=True)

status_callback = None 

def set_status_callback(callback):
    """Register a callback for status updates."""
    global status_callback
    status_callback = callback

def update_status(message: str):
    """Send a status update to the frontend (or just print if no callback)."""
    print(f"Status update: {message}")  
    if status_callback:
        status_callback(str(message))
    else:
        print(message)

# ---------------------- OpenAI Helpers ----------------------
def open_ai_api_req(prompt: str) -> str:
    """Make a request to OpenAI's ChatCompletion API and return the text."""
    #update_status("Making OpenAI API request...")
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        update_status(f"OpenAI API error: {str(e)}")
        raise e


def create_name(open_ai_api_req_func, converted_prompt: str) -> str:
    """Generate a clean playlist name using OpenAI."""
    max_words = 2
    print("Creating playlist name...\n")
    update_status("Creating playlist name...")

    name_prompt = (
        f"{converted_prompt} playlist name must just be in the format: Playlist Name. "
        "Nothing else around it. No characters just the playlist name. "
        "No longer than 30 characters or 3 words"
    )
    playlist_name = open_ai_api_req_func(name_prompt)

    words = playlist_name.split()
    playlist_name = ' '.join(words[:max_words])
    playlist_name = ''.join(c for c in playlist_name if c.isalnum() or c.isspace())
    print(f"Playlist name: {playlist_name}\n")
    update_status(f"Generated playlist name: {playlist_name}")
    return playlist_name


def create_image_prompt(songs_list: list) -> str:
    """Generate an AI prompt for playlist image creation."""
    update_status("Creating image prompt...")

    raw_prompt = (
        f"make an abstract painting based on {songs_list} "
        "ignore any stuff here that might go against the image creation policy of OpenAI"
    )
    safe_prompt = sanitize_prompt(raw_prompt)
    result = open_ai_api_req(safe_prompt)
    update_status("Image prompt created successfully")
    return result


def create_image(songs_list: list) -> str:
    """Generate a playlist image using OpenAI and save locally."""
    print('Creating playlist image...')
    update_status('Creating playlist image...')
    ai_edited_prompt = create_image_prompt(songs_list)
    if len(ai_edited_prompt) >= 1000:
        ai_edited_prompt = ai_edited_prompt[:1000]

    safe_image_prompt = sanitize_prompt(ai_edited_prompt)

    update_status("Generating image with AI...")
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=safe_image_prompt,
            n=1,
            size="1024x1024"
        )
        update_status("Downloading and saving image...")
        image_url = response.data[0].url
        image_data = requests.get(image_url).content
        image_path = os.path.join(PLAYLIST_IMAGE_FOLDER, "playlist_image.jpeg")
        with open(image_path, "wb") as f:
            f.write(image_data)
        print(f"Playlist image saved to {image_path}")
        update_status("Playlist image saved successfully")
        return image_path
    except Exception as e:
        update_status(f"Image generation error: {str(e)}")
        print(f"Error generating image: {e}")
        return None


# ---------------------- Image Helpers ----------------------
def compress_image(image_path: str, output_path: str, max_width=1000, max_height=1000, quality=70) -> str | None:
    """Resize & compress an image."""
    update_status("Compressing image...")
    try:
        with Image.open(image_path) as img:
            img.thumbnail((max_width, max_height))
            img.save(output_path, format='JPEG', quality=quality)
            print(f"Image saved as {output_path} with reduced size.")
            update_status("Image compression completed")
            return output_path
    except Exception as e:
        print(f"An error occurred: {e}")
        update_status(f"Error compressing image: {e}")
        return None


def image_to_base64(image_path: str) -> str | None:
    """Convert an image file to a base64 string."""
    update_status("Converting image to base64...")
    try:
        with open(image_path, "rb") as image_file:
            result = base64.b64encode(image_file.read()).decode('utf-8')
            update_status("Image conversion completed")
            return result
    except Exception as e:
        print(f"An error occurred: {e}")
        update_status(f"Error converting image: {e}")
        return None


def sanitize_prompt(prompt: str) -> str:
    """
    Filter out any banned words from a prompt before sending to OpenAI's
    image generation. Replaces them with an empty string.
    """
    sanitized = prompt
    for word in BANNED_WORDS:
        sanitized = re.sub(rf"\b{re.escape(word)}\b", "", sanitized, flags=re.IGNORECASE)
    return sanitized.strip()


# ---------------------- Spotify Helpers ----------------------
def get_users_top_tracks(limit: int = 50) -> list[str]:
    print("Fetching your top tracks...")
    update_status("Fetching your top tracks...")
    top_tracks_data = sp.current_user_top_tracks(limit=limit)
    result = [f"{i+1}: {track['name']} - Popularity: {track['popularity']}"
              for i, track in enumerate(top_tracks_data.get('items', []))]
    update_status(f"Retrieved {len(result)} top tracks")
    return result


def get_users_top_artists(limit: int = 50) -> list[str]:
    print("Fetching your top artists...")
    update_status("Fetching your top artists...")
    top_artists_data = sp.current_user_top_artists(limit=limit)
    result = [f"{i+1}: {artist['name']}" for i, artist in enumerate(top_artists_data.get('items', []))]
    update_status(f"Retrieved {len(result)} top artists")
    return result


def start_playlist_generator(prompt: str, num_songs: int) -> str | None:
    """Create an AI-generated Spotify playlist with tracks and image."""
    print(f"Starting playlist generator: '{prompt}' with {num_songs} songs")
    update_status(f"Starting playlist generation: '{prompt}' with {num_songs} songs")
    
    converted_prompt = (
        f"create a list of {prompt} with the format: ('Track Name', 'Artist') "
        f"no numbers that must be {num_songs} long"
    )

    # ---------------------- Internal Helpers ----------------------
    def get_valid_access_token() -> str | None:
        update_status("Validating Spotify access token...")
        token_info = sp_oauth.get_cached_token()
        if not token_info:
            print("Not authorized or token has expired.")
            update_status("Error: Spotify token expired or not authorized")
            return None
        update_status("Spotify access token validated")
        return token_info['access_token']

    def get_track_uri(track_name: str, artist_name: str = "") -> str | None:
        result = sp.search(q=f"track:{track_name} artist:{artist_name}", type="track", limit=1)
        if result['tracks']['items']:
            return result['tracks']['items'][0]['uri']
        return None

    def build_track_name_list() -> list[tuple[str, str]]:
        print("Fetching track list from AI...")
        update_status("Generating track list with AI...")
        track_list_str = open_ai_api_req(converted_prompt)
        matches = re.findall(r"\('([^']+)', '([^']+)'\)", track_list_str)
        print(f"Found {len(matches)} tracks")
        update_status(f"AI generated {len(matches)} tracks")
        return matches[:num_songs]

    def build_track_uri_list(track_name_list: list[tuple[str, str]]) -> list[str]:
        update_status("Finding tracks on Spotify...")
        uris = []
        for i, (track, artist) in enumerate(track_name_list):
            update_status(f"Searching for track {i+1}/{len(track_name_list)}: {track}")
            uri = get_track_uri(track, artist)
            if uri:
                uris.append(uri)
        update_status(f"Found {len(uris)} tracks on Spotify")
        return uris

    def add_songs_to_playlist(playlist_id: str, track_uris: list[str]) -> bool:
        if not track_uris:
            print("No valid tracks found.")
            update_status("Error: No valid tracks found")
            return False
        update_status(f"Adding {len(track_uris)} songs to playlist...")
        sp.playlist_add_items(playlist_id, track_uris)
        print(f"Added {len(track_uris)} songs to playlist")
        update_status(f"Successfully added {len(track_uris)} songs to playlist")
        return True

    def add_playlist_image(playlist_id: str, image_path: str) -> bool:
        update_status("Uploading playlist cover image...")
        compressed_image_path = os.path.join(PLAYLIST_IMAGE_FOLDER, "compressed_img.jpeg")
        compressed_image = compress_image(image_path, compressed_image_path, 300, 300, 70)
        image_base64 = image_to_base64(compressed_image)

        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/images"
        headers = {
            "Authorization": f"Bearer {get_valid_access_token()}",
            "Content-Type": "image/jpeg"
        }

        for attempt in range(3):
            try:
                update_status(f"Upload attempt {attempt + 1}/3...")
                response = requests.put(url, headers=headers, data=image_base64)
                if response.status_code == 202:
                    print("Playlist cover image updated successfully!")
                    update_status("Playlist cover image uploaded successfully!")
                    return True
                else:
                    print(f"Error uploading image: {response.status_code} {response.text}")
                    update_status(f"Upload error (attempt {attempt + 1}): {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"Request failed: {e}")
                update_status(f"Upload failed (attempt {attempt + 1}): {e}")
            time.sleep(3)
        print("Failed to upload playlist image after 3 attempts")
        update_status("Failed to upload playlist image after 3 attempts")
        return False

    # ---------------------- Playlist Creation ----------------------
    try:
        access_token = get_valid_access_token()
        if not access_token:
            return None

        update_status("Getting user information...")
        user_id = sp.current_user()["id"]
        playlist_name = create_name(open_ai_api_req, converted_prompt)
        
        update_status("Creating playlist on Spotify...")
        playlist_data = {
            "name": playlist_name,
            "description": "Generated using AI recommendations",
            "public": False
        }

        response = requests.post(
            f"https://api.spotify.com/v1/users/{user_id}/playlists",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
            json=playlist_data
        )
        if response.status_code != 201:
            print(f"Failed to create playlist: {response.status_code} {response.text}")
            update_status(f"Failed to create playlist: {response.status_code}")
            return None

        playlist_id = response.json()["id"]
        print(f"Playlist '{playlist_name}' created successfully! ID: {playlist_id}")
        update_status(f"Playlist '{playlist_name}' created successfully!")

        track_name_list = build_track_name_list()
        track_uris = build_track_uri_list(track_name_list)
        add_songs_to_playlist(playlist_id, track_uris)

        image_path = create_image(track_name_list)
        if image_path: 
            add_playlist_image(playlist_id, image_path)
        else:
            update_status("Playlist created without custom image")

        update_status("Playlist creation completed successfully!")
        return playlist_id

    except Exception as e:
        print(f"Error in playlist generation: {e}")
        update_status(f"Error: {str(e)}")
        return None