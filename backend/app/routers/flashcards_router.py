from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, FlashcardState
from ..schemas import FlashcardStateBulk, FlashcardStateResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/flashcards", tags=["flashcards"])


@router.get("/states", response_model=list[FlashcardStateResponse])
def get_states(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(FlashcardState).filter(FlashcardState.user_id == user.id).all()
    return rows


@router.put("/states")
def sync_states(payload: FlashcardStateBulk, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = {
        s.card_key: s
        for s in db.query(FlashcardState).filter(FlashcardState.user_id == user.id).all()
    }

    for item in payload.states:
        if item.card_key in existing:
            row = existing[item.card_key]
            row.status = item.status
            row.last_seen = item.last_seen
            row.interval_ms = item.interval_ms
        else:
            db.add(FlashcardState(
                user_id=user.id,
                card_key=item.card_key,
                status=item.status,
                last_seen=item.last_seen,
                interval_ms=item.interval_ms,
            ))

    db.commit()
    return {"synced": len(payload.states)}
