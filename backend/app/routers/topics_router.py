from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import LearnTopic
from ..schemas import LearnTopicResponse

router = APIRouter(prefix="/api/topics", tags=["topics"])


def _matches_course(topic: LearnTopic, course_key: str) -> bool:
    if topic.course_key == course_key:
        return True
    optional_in = topic.optional_in
    if isinstance(optional_in, list) and course_key in optional_in:
        return True
    return False


@router.get("/", response_model=list[LearnTopicResponse])
def list_topics(
    domain_id: int | None = Query(None),
    course_key: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(LearnTopic)
    if domain_id is not None:
        q = q.filter(LearnTopic.domain_id == domain_id)
    rows = q.order_by(LearnTopic.domain_id, LearnTopic.title).all()
    if course_key:
        rows = [r for r in rows if _matches_course(r, course_key)]
    return rows


@router.get("/{topic_id}", response_model=LearnTopicResponse)
def get_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(LearnTopic).filter(LearnTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic
