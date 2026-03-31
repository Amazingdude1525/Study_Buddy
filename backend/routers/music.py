from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from auth import get_current_user
from models import User
import random

router = APIRouter(prefix="/music", tags=["music"])


class Track(BaseModel):
    title: str
    artist: str
    youtube_url: str
    genre: str
    mood: str
    subject: Optional[str] = None


# Curated playlists — no API key needed
PLAYLISTS = {
    "focused": [
        Track(title="Lofi Hip Hop Radio", artist="ChilledCow", youtube_url="https://www.youtube.com/watch?v=jfKfPfyJRdk", genre="lofi", mood="focused"),
        Track(title="Deep Work Study Music", artist="Greenred Productions", youtube_url="https://www.youtube.com/watch?v=lTRiuFIWV54", genre="ambient", mood="focused"),
        Track(title="Study Music Alpha Waves", artist="YellowBrickCinema", youtube_url="https://www.youtube.com/watch?v=WPni755-Krg", genre="binaural", mood="focused"),
        Track(title="Coding Music Flow", artist="Lofi Girl", youtube_url="https://www.youtube.com/watch?v=n61ULEU7CO0", genre="lofi", mood="focused"),
        Track(title="Piano Focus Music", artist="RelaxingRecords", youtube_url="https://www.youtube.com/watch?v=0LsM5HCAXOM", genre="classical", mood="focused"),
    ],
    "happy": [
        Track(title="Happy Indie Pop Mix", artist="Various", youtube_url="https://www.youtube.com/watch?v=ZbZSe6N_BXs", genre="indie", mood="happy"),
        Track(title="Feel Good Afternoon", artist="Lofi Girl", youtube_url="https://www.youtube.com/watch?v=7NOSDKb0HlU", genre="lofi", mood="happy"),
        Track(title="Upbeat Study Playlist", artist="StudyVibes", youtube_url="https://www.youtube.com/watch?v=H-8TaBXT_XI", genre="pop", mood="happy"),
        Track(title="Morning Coffee Jazz", artist="Coffee Jazz", youtube_url="https://www.youtube.com/watch?v=Dx5qFachd3A", genre="jazz", mood="happy"),
    ],
    "sad": [
        Track(title="Sad Lofi Hip Hop", artist="Lofi Girl", youtube_url="https://www.youtube.com/watch?v=HMnrl0tmd3k", genre="lofi", mood="sad"),
        Track(title="Melancholy Piano", artist="Various", youtube_url="https://www.youtube.com/watch?v=4oStw0r33so", genre="piano", mood="sad"),
        Track(title="Rainy Day Study", artist="Chillhop Music", youtube_url="https://www.youtube.com/watch?v=MEmdnMpKzXo", genre="ambient", mood="sad"),
    ],
    "angry": [
        Track(title="Calm Classical Focus", artist="Various", youtube_url="https://www.youtube.com/watch?v=jgpJVI3tDbY", genre="classical", mood="angry"),
        Track(title="Meditation Focus Music", artist="Greenred Productions", youtube_url="https://www.youtube.com/watch?v=77ZozI0rw7w", genre="meditation", mood="angry"),
        Track(title="Peaceful Piano", artist="Peder B. Helland", youtube_url="https://www.youtube.com/watch?v=2OEL4P1Rz04", genre="piano", mood="angry"),
    ],
    "neutral": [
        Track(title="Chillhop Essentials", artist="Chillhop Music", youtube_url="https://www.youtube.com/watch?v=5yx6BWlEVcY", genre="lofi", mood="neutral"),
        Track(title="Instrumental Study", artist="Various", youtube_url="https://www.youtube.com/watch?v=lFcSrYw-ARY", genre="instrumental", mood="neutral"),
        Track(title="Ambient Focus", artist="Brian Eno", youtube_url="https://www.youtube.com/watch?v=sTGN5XHSW5E", genre="ambient", mood="neutral"),
    ],
}

SUBJECT_OVERRIDES = {
    "coding": [
        Track(title="Synthwave Coding Mix", artist="Various", youtube_url="https://www.youtube.com/watch?v=4xDzrJKXOOY", genre="synthwave", mood="focused", subject="coding"),
        Track(title="Cyberpunk Study Music", artist="Various", youtube_url="https://www.youtube.com/watch?v=qRHFSyoJRdM", genre="electronic", mood="focused", subject="coding"),
    ],
    "math": [
        Track(title="Bach for Mathematics", artist="JS Bach", youtube_url="https://www.youtube.com/watch?v=XHMCfZtG3fw", genre="classical", mood="focused", subject="math"),
        Track(title="Classical Study — Mozart", artist="Mozart", youtube_url="https://www.youtube.com/watch?v=Rb0UmrCXxVg", genre="classical", mood="focused", subject="math"),
    ],
    "history": [
        Track(title="Epic Orchestral Study", artist="Various", youtube_url="https://www.youtube.com/watch?v=EvXKBEJ-Gj0", genre="orchestral", mood="focused", subject="history"),
    ],
    "language": [
        Track(title="Acoustic Cafe Study", artist="Various", youtube_url="https://www.youtube.com/watch?v=PhkIIyoOGFc", genre="acoustic", mood="focused", subject="language"),
    ],
}


@router.get("/suggest", response_model=List[Track])
def suggest_music(
    mood: str = Query("focused"),
    subject: str = Query(""),
    user: User = Depends(get_current_user),
):
    """Return music suggestions based on mood and subject."""
    tracks = []

    # Subject-specific overrides first
    subj_lower = subject.lower()
    for key, subj_tracks in SUBJECT_OVERRIDES.items():
        if key in subj_lower:
            tracks.extend(subj_tracks)
            break

    # Add mood-based tracks
    mood_tracks = PLAYLISTS.get(mood, PLAYLISTS["focused"])
    tracks.extend(mood_tracks)

    # Shuffle and return up to 5
    random.shuffle(tracks)
    return tracks[:5]


@router.get("/moods")
def list_moods():
    return {"moods": list(PLAYLISTS.keys()), "subjects": list(SUBJECT_OVERRIDES.keys())}
