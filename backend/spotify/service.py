import os
from .client import sp

def get_users_top_tracks(folder='User Data', filename='TopTracks.txt'):
    print("Fetching your top tracks...")
    top_tracks_data = sp.current_user_top_tracks(limit=50)
    top_tracks = [(track['name'], track['popularity']) for track in top_tracks_data.get('items', [])]

    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, filename)

    with open(file_path, "w", encoding="utf-8") as file:
        for i, (track_name, track_popularity) in enumerate(top_tracks, start=1):
            file.write(f"{i}: {track_name} - Popularity: {track_popularity}\n")
            print(f"{i}: {track_name} - Popularity: {track_popularity}")

    print(f"\nTop tracks have been saved to {filename}\n")
