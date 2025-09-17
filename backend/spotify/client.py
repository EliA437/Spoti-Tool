from dotenv import load_dotenv
from pathlib import Path
import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Load environment variables
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Get credentials from .env
client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI")
scope = "playlist-modify-private playlist-modify-public user-top-read ugc-image-upload"

# Spotify OAuth object
sp_oauth = SpotifyOAuth(
    client_id=client_id,
    client_secret=client_secret,
    redirect_uri=redirect_uri,
    scope=scope,
    cache_path=".spotifycache",
    show_dialog=True
)

# Spotify client
sp = spotipy.Spotify(auth_manager=sp_oauth)

