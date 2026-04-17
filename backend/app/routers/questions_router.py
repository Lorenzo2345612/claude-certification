from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Question
from ..schemas import QuestionResponse

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.get("/", response_model=list[QuestionResponse])
def list_questions(domain_id: int | None = Query(None), db: Session = Depends(get_db)):
    q = db.query(Question)
    if domain_id is not None:
        q = q.filter(Question.domain_id == domain_id)
    return q.order_by(Question.id).all()


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question
