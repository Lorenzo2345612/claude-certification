from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    exam_attempts = relationship("ExamAttempt", back_populates="user", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(String(100), nullable=False, index=True)
    content = Column(Text, nullable=False, default="")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notes")

    __table_args__ = (
        UniqueConstraint("user_id", "topic_id", name="uq_user_topic"),
    )


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(String(100), nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="progress")

    __table_args__ = (
        UniqueConstraint("user_id", "topic_id", name="uq_user_progress"),
    )


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, autoincrement=False)
    domain_id = Column(Integer, nullable=False, index=True)
    domain = Column(String(200), nullable=False)
    scenario = Column(String(500), default="")
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)
    correct_answer = Column(String(10), nullable=False)
    explanation = Column(Text, default="")
    why_others_wrong = Column(JSON, default=dict)
    doc_reference = Column(JSON, nullable=True)
    doc_status = Column(String(50), nullable=True)
    skilljar_ref = Column(JSON, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class LearnTopic(Base):
    __tablename__ = "learn_topics"

    id = Column(String(100), primary_key=True)
    domain_id = Column(Integer, nullable=False, index=True)
    domain = Column(String(200), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False, default="")
    doc_url = Column(String(500), nullable=True)
    doc_label = Column(String(200), nullable=True)
    related_topics = Column(JSON, default=list)
    skilljar_refs = Column(JSON, nullable=True)
    anthropic_docs_ref = Column(JSON, nullable=True)
    summary = Column(Text, nullable=True)
    key_concepts = Column(JSON, default=list)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ExamAttempt(Base):
    __tablename__ = "exam_attempts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    passed = Column(Boolean, nullable=False)
    domains_selected = Column(JSON, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="exam_attempts")
    answers = relationship("ExamAnswer", back_populates="attempt", cascade="all, delete-orphan")


class ExamAnswer(Base):
    __tablename__ = "exam_answers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    attempt_id = Column(Integer, ForeignKey("exam_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, nullable=False)
    domain_id = Column(Integer, nullable=False)
    selected_answer = Column(String(10), nullable=False)
    correct_answer = Column(String(10), nullable=False)
    is_correct = Column(Boolean, nullable=False)

    attempt = relationship("ExamAttempt", back_populates="answers")
