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
    is_matched: bool = True  # Default true for now


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
                enforce_detection=False,
                detector_backend="retinaface",
                silent=True,
            )
        except Exception as e:
            return EmotionResult(
                dominant_emotion="Detection Error",
                scores={"none": 100.0},
                mood_category="unfocused",
            )

        if isinstance(results, list):
            result = results[0]
        else:
            result = results

        dominant = result.get("dominant_emotion", "neutral")
        scores = result.get("emotion", {})
        
        # [NEW] Face Verification (Identity Lock)
        is_matched = True
        if user.face_id_snapshot:
            try:
                # Prepare verification image (enrolled)
                enrolled_data = user.face_id_snapshot
                if "," in enrolled_data: enrolled_data = enrolled_data.split(",")[1]
                enrolled_bytes = base64.b64decode(enrolled_data)
                enrolled_img = Image.open(io.BytesIO(enrolled_bytes)).convert("RGB")
                enrolled_array = np.array(enrolled_img)

                verify_res = DeepFace.verify(
                    img1_path=img_array,
                    img2_path=enrolled_array,
                    enforce_detection=False,
                    detector_backend="retinaface",
                    silent=True
                )
                is_matched = verify_res.get("verified", False)
            except Exception:
                is_matched = False

        # [NEW] Save snapshot for admin review
        confidence = round(scores.get(dominant, 0), 1)
        snapshot = WebcamSnapshot(
            user_id=user.id,
            snapshot_data=payload.image_base64,
            emotion_detected=f"{dominant} (Conf: {confidence}%, Match: {is_matched})"
        )
        db.add(snapshot)
        db.commit()

        return EmotionResult(
            dominant_emotion=dominant,
            scores={k: round(v, 2) for k, v in scores.items()},
            mood_category=EMOTION_TO_MOOD.get(dominant, "focused"),
            is_matched=is_matched
        )

    except ImportError:
        # DeepFace not installed — return mock for dev
        return EmotionResult(
            dominant_emotion="neutral",
            scores={"neutral": 85.0, "happy": 10.0, "sad": 5.0},
            mood_category="focused",
            is_matched=True
        )
    except Exception as e:
        # Other unknown error
        return EmotionResult(
            dominant_emotion="Camera/Analysis Error",
            scores={"none": 100.0},
            mood_category="unfocused",
        )
