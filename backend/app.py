from queue import Queue, Empty
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import threading
from spotify.service import get_users_top_tracks, get_users_top_artists, set_status_callback, start_playlist_generator, update_status

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

status_queue = Queue()

set_status_callback(lambda msg: status_queue.put(str(msg)))

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

@app.post("/api/playlist-generator")
def api_playlist_generator(req: PlaylistRequest):
    print("Starting playlist generation in a background thread...")
    
    while not status_queue.empty():
        try:
            status_queue.get_nowait()
        except Empty:
            break

    def worker():
        try:
            result = start_playlist_generator(req.prompt, req.num_songs)
            if result:
                update_status("COMPLETED")  
            else:
                update_status("FAILED")  
        except Exception as e:
            update_status(f"ERROR: {e}")
            update_status("FAILED")

    threading.Thread(target=worker, daemon=True).start()

    return {"message": "Playlist generation started!"}

@app.get("/api/playlist-generator/stream")
def api_playlist_generator_stream():
    """
    Streaming endpoint for current playlist generator status.
    Only reads the messages that the generator sends to the global callback.
    """
    def event_stream():
        try:
            while True:
                try:
                    msg = status_queue.get(timeout=30) 
                    yield f"data: {msg}\n\n"
                    
                    if msg in ["COMPLETED", "FAILED"] or msg.startswith("ERROR:"):
                        break
                        
                except Empty:
                    yield f"data: heartbeat\n\n"
                    continue
                    
        except Exception as e:
            yield f"data: Stream error: {e}\n\n"
    
    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}