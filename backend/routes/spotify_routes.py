from fastapi import APIRouter
from spotify.service import get_users_top_tracks

router = APIRouter()

@router.get("/top-tracks")
def top_tracks():
    get_users_top_tracks()
    return {"message": "Top tracks fetched and saved."}
