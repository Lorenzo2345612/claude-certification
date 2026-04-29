from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import User, SharedExam, Question
from ..schemas import (
    SharedExamCreate,
    SharedExamSummary,
    SharedExamDetail,
    SharedExamListPage,
    QuestionResponse,
)
from ..auth import get_current_user

router = APIRouter(prefix="/api/shared-exams", tags=["shared-exams"])


@router.post("/", response_model=SharedExamSummary)
def create_shared_exam(
    payload: SharedExamCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exam = SharedExam(
        creator_id=user.id,
        title=payload.title,
        question_ids=payload.question_ids,
        time_limit_minutes=payload.time_limit_minutes,
        domains_selected=payload.domains_selected,
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return _to_summary(exam, user.username)


@router.get("/", response_model=SharedExamListPage)
def list_shared_exams(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    total = db.query(SharedExam).count()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    exams = (
        db.query(SharedExam)
        .options(joinedload(SharedExam.creator))
        .order_by(SharedExam.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return SharedExamListPage(
        items=[_to_summary(e, e.creator.username) for e in exams],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{exam_id}", response_model=SharedExamDetail)
def get_shared_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(SharedExam).filter(SharedExam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Shared exam not found")
    questions = (
        db.query(Question)
        .filter(Question.id.in_(exam.question_ids))
        .all()
    )
    qmap = {q.id: q for q in questions}
    ordered = [qmap[qid] for qid in exam.question_ids if qid in qmap]
    return SharedExamDetail(
        id=exam.id,
        title=exam.title,
        creator_username=exam.creator.username,
        question_count=len(exam.question_ids),
        time_limit_minutes=exam.time_limit_minutes,
        domains_selected=exam.domains_selected,
        created_at=exam.created_at,
        questions=[QuestionResponse.model_validate(q) for q in ordered],
    )


def _to_summary(exam: SharedExam, creator_username: str) -> SharedExamSummary:
    return SharedExamSummary(
        id=exam.id,
        title=exam.title,
        creator_username=creator_username,
        question_count=len(exam.question_ids),
        time_limit_minutes=exam.time_limit_minutes,
        domains_selected=exam.domains_selected,
        created_at=exam.created_at,
    )
