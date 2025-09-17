from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from spotify.service import get_users_top_tracks, get_users_top_artists, start_playlist_generator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body schema for playlist creation
class PlaylistRequest(BaseModel):
    prompt: str
    num_songs: int

@app.get("/api/top-tracks")
def api_top_tracks():
    tracks = get_users_top_tracks()
    return tracks

@app.get("/api/top-artists")
def api_top_artists():
    tracks = get_users_top_artists()
    return tracks

# POST endpoint for creating playlist
@app.post("/api/playlist-generator")
def api_playlist_generator(req: PlaylistRequest):
    try:
        start_playlist_generator(req.prompt, req.num_songs)
        return {"message": "Playlist created successfully!"}
    except Exception as e:
        return {"message": f"Error creating playlist: {str(e)}"}
