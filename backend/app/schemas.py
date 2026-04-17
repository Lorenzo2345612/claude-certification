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
