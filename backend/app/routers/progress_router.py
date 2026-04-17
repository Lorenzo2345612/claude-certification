from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Progress
from ..schemas import ProgressToggle, ProgressResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("/", response_model=list[ProgressResponse])
def list_progress(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Progress).filter(Progress.user_id == user.id).all()


@router.post("/toggle", response_model=list[ProgressResponse])
def toggle_progress(
    payload: ProgressToggle,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Progress).filter(
        Progress.user_id == user.id,
        Progress.topic_id == payload.topic_id,
    ).first()

    if existing:
        db.delete(existing)
    else:
        db.add(Progress(user_id=user.id, topic_id=payload.topic_id))

    db.commit()
    return db.query(Progress).filter(Progress.user_id == user.id).all()
