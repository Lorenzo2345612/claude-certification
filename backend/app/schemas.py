from pydantic import BaseModel, Field
from datetime import datetime


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=128)


class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class NoteUpdate(BaseModel):
    content: str = Field(..., max_length=50000)


class NoteResponse(BaseModel):
    id: int
    topic_id: str
    content: str
    updated_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


class ProgressToggle(BaseModel):
    topic_id: str = Field(..., max_length=100)


class ProgressResponse(BaseModel):
    topic_id: str
    completed_at: datetime

    model_config = {"from_attributes": True}


class QuestionResponse(BaseModel):
    id: int
    domain_id: int
    domain: str
    scenario: str
    question: str
    options: list
    correct_answer: str
    explanation: str
    why_others_wrong: dict | None = None
    doc_reference: dict | None = None
    doc_status: str | None = None
    skilljar_ref: dict | None = None

    model_config = {"from_attributes": True}


class LearnTopicResponse(BaseModel):
    id: str
    domain_id: int
    domain: str
    title: str
    content: str
    doc_url: str | None = None
    doc_label: str | None = None
    related_topics: list = []
    skilljar_refs: list | None = None
    anthropic_docs_ref: str | None = None
    summary: str | None = None
    key_concepts: list = []

    model_config = {"from_attributes": True}
