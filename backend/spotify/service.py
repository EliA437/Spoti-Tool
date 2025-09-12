from .client import sp

from .client import sp

def get_users_top_tracks(limit: int = 50):
    """
    Fetch the current user's top tracks and return a list of nicely formatted strings.
    """
    print("Fetching your top tracks...")

    top_tracks_data = sp.current_user_top_tracks(limit=limit)
    top_tracks = [
        (track['name'], track['popularity'])
        for track in top_tracks_data.get('items', [])
    ]

    formatted_tracks = []
    for i, (name, popularity) in enumerate(top_tracks, start=1):
        line = f"{i}: {name} - Popularity: {popularity}"
        formatted_tracks.append(line)

    return formatted_tracks

def get_users_top_artists(limit: int = 50):
    """
    Fetch the current user's top artists and return a list of nicely formatted strings.
    """
    print("Fetching your top artists...")

    top_artists_data = sp.current_user_top_artists(limit=limit)
    top_artists = [
        artist['name'] 
        for artist in top_artists_data.get('items', [])
    ]

    formatted_artists = []
    for i, name in enumerate(top_artists, start=1):
        line = f"{i}: {name}"
        formatted_artists.append(line)

    return formatted_artists


