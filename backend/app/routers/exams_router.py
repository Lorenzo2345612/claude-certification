from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Integer
from sqlalchemy.orm import Session
from sqlalchemy import func as sqlfunc

from ..database import get_db
from ..models import User, ExamAttempt, ExamAnswer
from ..schemas import ExamSubmit, ExamAttemptResponse, ExamAttemptSummary, ExamStatsResponse, DomainStat
from ..auth import get_current_user

router = APIRouter(prefix="/api/exams", tags=["exams"])


@router.post("/", response_model=ExamAttemptResponse)
def submit_exam(payload: ExamSubmit, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    attempt = ExamAttempt(
        user_id=user.id,
        total_questions=payload.total_questions,
        correct_count=payload.correct_count,
        score=payload.score,
        passed=payload.passed,
        domains_selected=payload.domains_selected,
    )
    db.add(attempt)
    db.flush()

    for a in payload.answers:
        db.add(ExamAnswer(
            attempt_id=attempt.id,
            question_id=a.question_id,
            domain_id=a.domain_id,
            selected_answer=a.selected_answer,
            correct_answer=a.correct_answer,
            is_correct=a.is_correct,
        ))

    db.commit()
    db.refresh(attempt)
    return attempt


@router.get("/", response_model=list[ExamAttemptSummary])
def list_exams(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(ExamAttempt).filter(
        ExamAttempt.user_id == user.id
    ).order_by(ExamAttempt.completed_at.desc()).all()


@router.get("/stats", response_model=ExamStatsResponse)
def get_stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    attempts = db.query(ExamAttempt).filter(ExamAttempt.user_id == user.id).all()

    if not attempts:
        return ExamStatsResponse(
            total_exams=0, avg_score=0, best_score=0, pass_rate=0,
            domain_stats=[], recent_scores=[]
        )

    scores = [a.score for a in attempts]
    passed_count = sum(1 for a in attempts if a.passed)

    # Domain stats from all answers across all attempts
    domain_answers = db.query(
        ExamAnswer.domain_id,
        sqlfunc.count(ExamAnswer.id).label('total'),
        sqlfunc.sum(sqlfunc.cast(ExamAnswer.is_correct, Integer)).label('correct'),
    ).join(ExamAttempt).filter(
        ExamAttempt.user_id == user.id
    ).group_by(ExamAnswer.domain_id).all()

    domain_stats = []
    for row in domain_answers:
        total = row.total
        correct = int(row.correct or 0)
        domain_stats.append(DomainStat(
            domain_id=row.domain_id,
            total=total,
            correct=correct,
            percentage=round((correct / total) * 100, 1) if total > 0 else 0,
        ))

    recent = sorted(attempts, key=lambda a: a.completed_at, reverse=True)[:10]

    return ExamStatsResponse(
        total_exams=len(attempts),
        avg_score=round(sum(scores) / len(scores)),
        best_score=max(scores),
        pass_rate=round((passed_count / len(attempts)) * 100, 1),
        domain_stats=sorted(domain_stats, key=lambda d: d.domain_id),
        recent_scores=[a.score for a in recent],
    )


@router.get("/{attempt_id}", response_model=ExamAttemptResponse)
def get_exam(attempt_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    attempt = db.query(ExamAttempt).filter(
        ExamAttempt.id == attempt_id, ExamAttempt.user_id == user.id
    ).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Exam not found")
    return attempt
