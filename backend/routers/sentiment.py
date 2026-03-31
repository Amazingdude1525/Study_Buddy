import base64
import io
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth import get_current_user
from database import get_session
from sqlmodel import Session
from models import User, WebcamSnapshot

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


class ImagePayload(BaseModel):
    image_base64: str  # data:image/png;base64,... or raw base64


class EmotionResult(BaseModel):
    dominant_emotion: str
    scores: dict
    mood_category: str  # happy, focused, sad, angry, neutral


EMOTION_TO_MOOD = {
    "happy": "happy",
    "surprise": "happy",
    "neutral": "focused",
    "sad": "sad",
    "fear": "sad",
    "disgust": "angry",
    "angry": "angry",
}


@router.post("/analyze")
async def analyze_sentiment(
    payload: ImagePayload,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Analyze face emotion from base64 image using DeepFace."""
    try:
        from deepface import DeepFace
        from PIL import Image

        # Decode base64 to image
        img_data = payload.image_base64
        if "," in img_data:
            img_data = img_data.split(",")[1]

        img_bytes = base64.b64decode(img_data)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img_array = np.array(img)

        try:
            results = DeepFace.analyze(
                img_path=img_array,
                actions=["emotion"],
                enforce_detection=True,
                silent=True,
            )
        except ValueError:
            return EmotionResult(
                dominant_emotion="No Human Face Detected",
                scores={"none": 100.0},
                mood_category="unfocused",
            )

        if isinstance(results, list):
            result = results[0]
        else:
            result = results

        dominant = result.get("dominant_emotion", "neutral")
        scores = result.get("emotion", {})

        # [NEW] Save snapshot for admin review
        snapshot = WebcamSnapshot(
            user_id=user.id,
            snapshot_data=payload.image_base64,
            emotion_detected=dominant
        )
        db.add(snapshot)
        db.commit()

        return EmotionResult(
            dominant_emotion=dominant,
            scores={k: round(v, 2) for k, v in scores.items()},
            mood_category=EMOTION_TO_MOOD.get(dominant, "focused"),
        )

    except ImportError:
        # DeepFace not installed — return mock for dev
        return EmotionResult(
            dominant_emotion="neutral",
            scores={"neutral": 85.0, "happy": 10.0, "sad": 5.0},
            mood_category="focused",
        )
    except Exception as e:
        # Other unknown error
        return EmotionResult(
            dominant_emotion="Camera/Analysis Error",
            scores={"none": 100.0},
            mood_category="unfocused",
        )
