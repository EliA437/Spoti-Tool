from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import spotify_routes 
from spotify.service import get_users_top_tracks
from spotify.service import get_users_top_artists
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spotify_routes.router, prefix="/spotify")

@app.get("/api/top-tracks")
def api_top_tracks():
    tracks = get_users_top_tracks()
    return tracks

@app.get("/api/top-artists")
def api_top_artists():
    tracks = get_users_top_artists()
    return tracks
