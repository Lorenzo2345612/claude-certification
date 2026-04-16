from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Note
from ..schemas import NoteUpdate, NoteResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.get("/", response_model=list[NoteResponse])
def list_notes(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Note).filter(Note.user_id == user.id).order_by(Note.updated_at.desc()).all()


@router.get("/{topic_id}", response_model=NoteResponse)
def get_note(
    topic_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(Note).filter(Note.user_id == user.id, Note.topic_id == topic_id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


@router.put("/{topic_id}", response_model=NoteResponse)
def upsert_note(
    topic_id: str,
    payload: NoteUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(Note).filter(Note.user_id == user.id, Note.topic_id == topic_id).first()
    if note:
        note.content = payload.content
    else:
        note = Note(user_id=user.id, topic_id=topic_id, content=payload.content)
        db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    topic_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(Note).filter(Note.user_id == user.id, Note.topic_id == topic_id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    db.delete(note)
    db.commit()
