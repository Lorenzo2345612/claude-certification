from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Question
from ..schemas import QuestionResponse

router = APIRouter(prefix="/api/questions", tags=["questions"])


def _matches_course(course_keys, course_key: str, include_docs_only: bool) -> bool:
    if not course_keys or not isinstance(course_keys, list):
        return False
    if course_key in course_keys:
        return True
    if include_docs_only and "cca-docs-only" in course_keys:
        return True
    return False


@router.get("/", response_model=list[QuestionResponse])
def list_questions(
    domain_id: int | None = Query(None),
    course_key: str | None = Query(None),
    include_docs_only: bool = Query(False),
    db: Session = Depends(get_db),
):
    q = db.query(Question)
    if domain_id is not None:
        q = q.filter(Question.domain_id == domain_id)
    rows = q.order_by(Question.id).all()
    if course_key:
        rows = [r for r in rows if _matches_course(r.course_keys, course_key, include_docs_only)]
    return rows


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question
