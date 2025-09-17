import os
import re
import requests
import time
from .client import sp, sp_oauth
from .helpers import create_name, compress_image, image_to_base64, create_image, open_ai_api_req

def get_users_top_tracks(limit: int = 50):
    print("Fetching your top tracks...")
    top_tracks_data = sp.current_user_top_tracks(limit=limit)
    return [
        f"{i+1}: {track['name']} - Popularity: {track['popularity']}"
        for i, track in enumerate(top_tracks_data.get('items', []))
    ]

def get_users_top_artists(limit: int = 50):
    print("Fetching your top artists...")
    top_artists_data = sp.current_user_top_artists(limit=limit)
    return [
        f"{i+1}: {artist['name']}"
        for i, artist in enumerate(top_artists_data.get('items', []))
    ]

def start_playlist_generator(prompt: str, num_songs: int):
    """
    Creates a playlist using the provided prompt and number of songs.
    Returns the playlist ID if successful, None if failed.
    """
    print(f"Starting playlist generator: '{prompt}' with {num_songs} songs")
    converted_prompt = f"create a list of {prompt} with the format: ('Track Name', 'Artist') no numbers that must be {num_songs} long"

    # --------------------------
    # Helper functions
    # --------------------------
    def get_valid_access_token():
        token_info = sp_oauth.get_cached_token()
        if not token_info:
            print("Not authorized or token has expired.")
            return None
        return token_info['access_token']

    def get_track_uri(track_name, artist_name=""):
        query = f"track:{track_name} artist:{artist_name}"
        result = sp.search(q=query, type="track", limit=1)
        if result['tracks']['items']:
            return result['tracks']['items'][0]['uri']
        return None

    # AI generates track list
    def build_track_name_list():
        print("Fetching track list from AI...")
        track_list_str = open_ai_api_req(converted_prompt)
        pattern = r"\('([^']+)', '([^']+)'\)"
        matches = re.findall(pattern, track_list_str)
        print(f"Found {len(matches)} tracks")
        return matches[:num_songs]  # Limit to requested number of songs

    def build_track_uri_list():
        track_name_list = build_track_name_list()
        uris = [get_track_uri(track, artist) for track, artist in track_name_list]
        uris = [uri for uri in uris if uri]  # Remove None
        return uris

    # Add songs to playlist
    def add_songs_to_playlist(playlist_id):
        track_uris = build_track_uri_list()
        if not track_uris:
            print("No valid tracks found.")
            return False
        sp.playlist_add_items(playlist_id, track_uris)
        print(f"Added {len(track_uris)} songs to playlist")
        return True

    # Optional: set playlist cover image
    def add_playlist_image(playlist_id, image_path="Playlist Images/image_2.jpeg"):
        compressed_image_path = "Playlist Images/compressed_img.jpeg"
        compressed_image = compress_image(image_path, compressed_image_path, 300, 300, 70)
        image_base64 = image_to_base64(compressed_image)

        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/images"
        headers = {
            "Authorization": f"Bearer {get_valid_access_token()}",
            "Content-Type": "image/jpeg",
        }

        for attempt in range(3):
            try:
                response = requests.put(url, headers=headers, data=image_base64)
                if response.status_code == 202:
                    print("Playlist cover image updated successfully!")
                    return True
                else:
                    print(f"Error uploading image: {response.status_code} {response.text}")
            except requests.exceptions.RequestException as e:
                print(f"Request failed: {e}")
            time.sleep(3)
        print("Failed to upload playlist image after 3 attempts")
        return False

    # --------------------------
    # Main playlist creation
    # --------------------------
    access_token = get_valid_access_token()
    if not access_token:
        return None

    user_id = sp.current_user()["id"]
    playlist_name = create_name(converted_prompt)
    playlist_data = {
        "name": playlist_name,
        "description": "Generated using AI recommendations",
        "public": False,
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    response = requests.post(f"https://api.spotify.com/v1/users/{user_id}/playlists",
                             headers=headers, json=playlist_data)
    if response.status_code != 201:
        print(f"Failed to create playlist: {response.status_code} {response.text}")
        return None

    playlist_id = response.json()["id"]
    print(f"Playlist '{playlist_name}' created successfully! ID: {playlist_id}")

    # Add songs
    if not add_songs_to_playlist(playlist_id):
        print("Playlist created but no songs were added.")

    # Optional: add cover image (skip if not needed)
    add_playlist_image(playlist_id)

    return playlist_id
