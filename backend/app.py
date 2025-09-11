from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import spotify_routes 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spotify_routes.router, prefix="/spotify")
