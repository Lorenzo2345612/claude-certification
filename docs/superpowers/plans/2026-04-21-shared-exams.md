# Shared Exams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Exams" tab where users can share practice exam sessions publicly and others can take the same exact question set.

**Architecture:** A new `shared_exams` DB table stores the question ID list from a practice session. The `exam_attempts` table gets a nullable `shared_exam_id` FK so attempts taken from the Exams tab are linked back to the shared exam. The frontend adds a "Share Exam" button on the ResultsScreen (practice only) and a new ExamsScreen that lists all shared exams and lets users take them through the existing QuizScreen.

**Tech Stack:** FastAPI + SQLAlchemy + Alembic + MySQL (backend), React 19 + React Router 7 + Vite (frontend `quiz-app/`), pytest + httpx for backend tests.

---

### Task 1: Add shared exams DB migration

**Files:**
- Create: `backend/alembic/versions/0004_add_shared_exams.py`

- [ ] **Step 1: Write the migration file**

```python
"""add shared_exams table and shared_exam_id to exam_attempts

Revision ID: 0004
Revises: 0003
Create Date: 2026-04-21

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect

revision: str = '0004'
down_revision: Union[str, Sequence[str], None] = '0003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa_inspect(bind)
    tables = inspector.get_table_names()

    if 'shared_exams' not in tables:
        op.create_table(
            'shared_exams',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('creator_id', sa.Integer(), nullable=False),
            sa.Column('title', sa.String(255), nullable=False),
            sa.Column('question_ids', sa.JSON(), nullable=False),
            sa.Column('time_limit_minutes', sa.Integer(), nullable=True),
            sa.Column('domains_selected', sa.JSON(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.ForeignKeyConstraint(['creator_id'], ['users.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )

    existing_cols = [c['name'] for c in inspector.get_columns('exam_attempts')]
    if 'shared_exam_id' not in existing_cols:
        op.add_column(
            'exam_attempts',
            sa.Column('shared_exam_id', sa.Integer(), sa.ForeignKey('shared_exams.id', ondelete='SET NULL'), nullable=True)
        )


def downgrade() -> None:
    op.drop_column('exam_attempts', 'shared_exam_id')
    op.drop_table('shared_exams')
```

- [ ] **Step 2: Commit**

```bash
git add backend/alembic/versions/0004_add_shared_exams.py
git commit -m "feat: add migration for shared_exams table and shared_exam_id column"
```

---

### Task 2: Add SQLAlchemy models

**Files:**
- Modify: `backend/app/models.py`

- [ ] **Step 1: Add `SharedExam` model and update `ExamAttempt`**

In `backend/app/models.py`, add the `SharedExam` class after the `ExamAnswer` class:

```python
class SharedExam(Base):
    __tablename__ = "shared_exams"

    id = Column(Integer, primary_key=True, autoincrement=True)
    creator_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    question_ids = Column(JSON, nullable=False)
    time_limit_minutes = Column(Integer, nullable=True)
    domains_selected = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    creator = relationship("User", back_populates="shared_exams")
```

Update the `User` model — add to the relationships block (after `flashcard_states`):

```python
shared_exams = relationship("SharedExam", back_populates="creator", cascade="all, delete-orphan")
```

Update `ExamAttempt` — add a new column after `completed_at`:

```python
shared_exam_id = Column(Integer, ForeignKey("shared_exams.id", ondelete="SET NULL"), nullable=True)
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/models.py
git commit -m "feat: add SharedExam model and shared_exam_id to ExamAttempt"
```

---

### Task 3: Add Pydantic schemas for shared exams

**Files:**
- Modify: `backend/app/schemas.py`

- [ ] **Step 1: Add schemas at the end of `backend/app/schemas.py`**

```python
class SharedExamCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    question_ids: list[int]
    time_limit_minutes: int | None = None
    domains_selected: list[int]


class SharedExamSummary(BaseModel):
    id: int
    title: str
    creator_username: str
    question_count: int
    time_limit_minutes: int | None = None
    domains_selected: list
    created_at: datetime

    model_config = {"from_attributes": True}


class SharedExamDetail(BaseModel):
    id: int
    title: str
    creator_username: str
    question_count: int
    time_limit_minutes: int | None = None
    domains_selected: list
    created_at: datetime
    questions: list[QuestionResponse]

    model_config = {"from_attributes": True}
```

Also update `ExamSubmit` to accept an optional `shared_exam_id`:

Find the `ExamSubmit` class and add one field:

```python
class ExamSubmit(BaseModel):
    total_questions: int
    correct_count: int
    score: int
    passed: bool
    domains_selected: list[int]
    time_limit_minutes: int | None = None
    status: str = "completed"
    answers: list[ExamAnswerSubmit]
    shared_exam_id: int | None = None   # <-- add this line
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/schemas.py
git commit -m "feat: add SharedExam pydantic schemas and shared_exam_id to ExamSubmit"
```

---

### Task 4: Set up backend test infrastructure

**Files:**
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/conftest.py`

- [ ] **Step 1: Install test dependencies**

Add to `backend/requirements.txt` (after existing entries):

```
pytest==8.3.5
pytest-asyncio==0.25.3
httpx==0.28.1
```

- [ ] **Step 2: Create `backend/tests/__init__.py`**

Empty file.

- [ ] **Step 3: Create `backend/tests/conftest.py`**

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models import User, SharedExam, ExamAttempt  # noqa: F401 — register models

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    return TestingSessionLocal()


@pytest.fixture
def client():
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def auth_client(client, db):
    """Returns a TestClient with a registered+logged-in user and the user object."""
    client.post("/api/auth/register", json={"username": "testuser", "password": "testpass"})
    resp = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = resp.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})
    user = db.query(User).filter(User.username == "testuser").first()
    return client, user
```

- [ ] **Step 4: Commit**

```bash
git add backend/requirements.txt backend/tests/__init__.py backend/tests/conftest.py
git commit -m "feat: add pytest test infrastructure with SQLite in-memory DB"
```

---

### Task 5: Create the shared_exams router (TDD)

**Files:**
- Create: `backend/tests/test_shared_exams.py`
- Create: `backend/app/routers/shared_exams_router.py`

- [ ] **Step 1: Write failing tests in `backend/tests/test_shared_exams.py`**

```python
import pytest
from app.models import Question, SharedExam


def seed_question(db, qid=1, domain_id=1):
    q = Question(
        id=qid,
        domain_id=domain_id,
        domain="Test Domain",
        scenario="Scenario",
        question="What is X?",
        options=[{"id": "a", "text": "A", "correct": True}, {"id": "b", "text": "B", "correct": False}],
        correct_answer="a",
        explanation="Because A.",
    )
    db.add(q)
    db.commit()
    return q


def test_create_shared_exam_requires_auth(client):
    resp = client.post("/api/shared-exams/", json={
        "title": "My Exam",
        "question_ids": [1],
        "time_limit_minutes": 30,
        "domains_selected": [1],
    })
    assert resp.status_code == 401


def test_create_shared_exam(auth_client, db):
    client, user = auth_client
    seed_question(db)
    resp = client.post("/api/shared-exams/", json={
        "title": "My Exam",
        "question_ids": [1],
        "time_limit_minutes": 30,
        "domains_selected": [1],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "My Exam"
    assert data["creator_username"] == "testuser"
    assert data["question_count"] == 1


def test_list_shared_exams_is_public(client, auth_client, db):
    ac, user = auth_client
    seed_question(db)
    ac.post("/api/shared-exams/", json={
        "title": "Shared",
        "question_ids": [1],
        "time_limit_minutes": None,
        "domains_selected": [1],
    })
    # unauthenticated client can list
    resp = client.get("/api/shared-exams/")
    assert resp.status_code == 200
    exams = resp.json()
    assert len(exams) == 1
    assert exams[0]["title"] == "Shared"
    assert exams[0]["creator_username"] == "testuser"


def test_get_shared_exam_detail(client, auth_client, db):
    ac, user = auth_client
    seed_question(db)
    create_resp = ac.post("/api/shared-exams/", json={
        "title": "Detail Exam",
        "question_ids": [1],
        "time_limit_minutes": 60,
        "domains_selected": [1],
    })
    exam_id = create_resp.json()["id"]
    resp = client.get(f"/api/shared-exams/{exam_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Detail Exam"
    assert len(data["questions"]) == 1
    assert data["questions"][0]["id"] == 1


def test_get_shared_exam_not_found(client):
    resp = client.get("/api/shared-exams/9999")
    assert resp.status_code == 404
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/test_shared_exams.py -v
```

Expected: import errors or 404s — the router doesn't exist yet.

- [ ] **Step 3: Create `backend/app/routers/shared_exams_router.py`**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, SharedExam, Question
from ..schemas import SharedExamCreate, SharedExamSummary, SharedExamDetail, QuestionResponse
from ..auth import get_current_user, get_optional_user

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


@router.get("/", response_model=list[SharedExamSummary])
def list_shared_exams(db: Session = Depends(get_db)):
    exams = db.query(SharedExam).order_by(SharedExam.created_at.desc()).all()
    return [_to_summary(e, e.creator.username) for e in exams]


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
    # Restore original order from question_ids
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend && python -m pytest tests/test_shared_exams.py -v
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/app/routers/shared_exams_router.py backend/tests/test_shared_exams.py
git commit -m "feat: add shared_exams router with create/list/detail endpoints (TDD)"
```

---

### Task 6: Register shared_exams router in main.py + update exams_router

**Files:**
- Modify: `backend/app/main.py`
- Modify: `backend/app/routers/exams_router.py`

- [ ] **Step 1: Register the new router in `backend/app/main.py`**

At line 9, add `shared_exams_router` to the import and also add `SharedExam` to the model imports:

```python
from .models import User, Note, Progress, Question, LearnTopic, ExamAttempt, ExamAnswer, FlashcardState, SharedExam  # noqa: F401
from .routers import auth_router, notes_router, progress_router, questions_router, topics_router, exams_router, flashcards_router, shared_exams_router
```

After `app.include_router(flashcards_router.router)` (line 67), add:

```python
app.include_router(shared_exams_router.router)
```

- [ ] **Step 2: Update `submit_exam` in `backend/app/routers/exams_router.py` to save `shared_exam_id`**

In the `submit_exam` function, update the `ExamAttempt(...)` construction to include:

```python
attempt = ExamAttempt(
    user_id=user.id,
    total_questions=payload.total_questions,
    correct_count=payload.correct_count,
    score=payload.score,
    passed=payload.passed,
    domains_selected=payload.domains_selected,
    time_limit_minutes=payload.time_limit_minutes,
    status=payload.status,
    shared_exam_id=payload.shared_exam_id,   # <-- add this line
)
```

- [ ] **Step 3: Verify the server starts without errors** (run locally if Docker is available, otherwise skip and rely on CI)

```bash
cd backend && python -m pytest tests/ -v
```

Expected: all tests still pass.

- [ ] **Step 4: Commit**

```bash
git add backend/app/main.py backend/app/routers/exams_router.py
git commit -m "feat: register shared_exams router and wire shared_exam_id into exam submissions"
```

---

### Task 7: Extract shared frontend utilities

**Files:**
- Create: `quiz-app/src/utils.js`
- Modify: `quiz-app/src/components/PracticeScreen.jsx`

The `mapQuestionKeys` and `shuffleArray` functions currently live only in `PracticeScreen.jsx`. `ExamsScreen` needs the same logic, so extract them.

- [ ] **Step 1: Create `quiz-app/src/utils.js`**

```js
export function mapQuestionKeys(q) {
  return {
    ...q,
    domainId: q.domain_id ?? q.domainId,
    correctAnswer: q.correct_answer ?? q.correctAnswer,
    whyOthersWrong: q.why_others_wrong ?? q.whyOthersWrong,
    docReference: q.doc_reference ?? q.docReference,
    docStatus: q.doc_status ?? q.docStatus,
    skilljarRef: q.skilljar_ref ?? q.skilljarRef,
  }
}

export function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function prepareQuestionsForQuiz(questions) {
  const letters = ['a', 'b', 'c', 'd']
  return shuffleArray(questions).map(q => {
    const shuffledOpts = shuffleArray(q.options)
    const remapped = shuffledOpts.map((opt, i) => ({ ...opt, id: letters[i] }))
    const newCorrect = remapped.find(o => o.correct)?.id || q.correctAnswer
    const oldToNew = {}
    shuffledOpts.forEach((opt, i) => { oldToNew[opt.id] = letters[i] })
    const newWhyWrong = {}
    if (q.whyOthersWrong) {
      Object.entries(q.whyOthersWrong).forEach(([oldKey, text]) => {
        newWhyWrong[oldToNew[oldKey] || oldKey] = text
      })
    }
    return { ...q, options: remapped, correctAnswer: newCorrect, whyOthersWrong: newWhyWrong }
  })
}
```

- [ ] **Step 2: Update `quiz-app/src/components/PracticeScreen.jsx` to import from utils**

At the top of the file, after the existing imports, add:

```js
import { mapQuestionKeys, shuffleArray, prepareQuestionsForQuiz } from '../utils'
```

Remove the local `mapQuestionKeys` and `shuffleArray` function definitions from `PracticeScreen.jsx` (they appear at lines 9-19 and 74-82).

Replace all occurrences of the inline shuffle+remap logic in `startQuiz` and `retryWrongQuestions` with `prepareQuestionsForQuiz`. In `startQuiz` (around line 273), replace:

```js
const letters = ['a', 'b', 'c', 'd']
const selected = shuffled.slice(0, count).map(q => {
  const shuffledOpts = shuffleArray(q.options)
  const remapped = shuffledOpts.map((opt, i) => ({ ...opt, id: letters[i] }))
  const newCorrect = remapped.find(o => o.correct)?.id || q.correctAnswer
  const oldToNew = {}
  shuffledOpts.forEach((opt, i) => { oldToNew[opt.id] = letters[i] })
  const newWhyWrong = {}
  if (q.whyOthersWrong) {
    Object.entries(q.whyOthersWrong).forEach(([oldKey, text]) => {
      newWhyWrong[oldToNew[oldKey] || oldKey] = text
    })
  }
  return { ...q, options: remapped, correctAnswer: newCorrect, whyOthersWrong: newWhyWrong }
})
```

with:

```js
const selected = prepareQuestionsForQuiz(shuffled.slice(0, count))
```

In `retryWrongQuestions` (around line 392), replace the same inline shuffle+remap block with:

```js
const reshuffled = prepareQuestionsForQuiz(wrongItems)
```

Also in the retake effect (around line 159), replace the inline shuffle+remap block with:

```js
const shuffled = prepareQuestionsForQuiz(filtered)
```

- [ ] **Step 3: Verify PracticeScreen still works**

Open the app in a browser (`npm run dev` in `quiz-app/`), go to Practice, start an exam, confirm questions load normally. No test runner needed — this is a visual check.

- [ ] **Step 4: Commit**

```bash
git add quiz-app/src/utils.js quiz-app/src/components/PracticeScreen.jsx
git commit -m "refactor: extract mapQuestionKeys/shuffleArray/prepareQuestionsForQuiz to utils.js"
```

---

### Task 8: Add shared exam API calls to api.js

**Files:**
- Modify: `quiz-app/src/api.js`

- [ ] **Step 1: Add three new methods to the `api` object in `quiz-app/src/api.js`**

After `getWeakQuestions()`, add:

```js
createSharedExam(data) {
  return request('/shared-exams/', {
    method: 'POST',
    body: data,
  })
},

getSharedExams() {
  return request('/shared-exams/')
},

getSharedExam(id) {
  return request(`/shared-exams/${id}`)
},
```

- [ ] **Step 2: Commit**

```bash
git add quiz-app/src/api.js
git commit -m "feat: add createSharedExam/getSharedExams/getSharedExam to api.js"
```

---

### Task 9: Add "Share Exam" button and modal to ResultsScreen

**Files:**
- Modify: `quiz-app/src/components/ResultsScreen.jsx`
- Modify: `quiz-app/src/components/PracticeScreen.jsx`

- [ ] **Step 1: Update `ResultsScreen` props and add share UI**

`ResultsScreen` receives a new optional prop `onShareExam` (a function taking a title string, returns a Promise). When this prop is provided, show a "Share Exam" button.

At the top of `ResultsScreen.jsx`, add `useState` is already imported. Add `onShareExam = null` to the props destructuring:

```js
export default function ResultsScreen({ questions, answers, domains, examStatus, onRestart, onRetryWrong, onShareExam = null }) {
```

Add share state variables inside the component (after the existing `useState` calls):

```js
const [showShareModal, setShowShareModal] = useState(false)
const [shareTitle, setShareTitle] = useState('')
const [shareLoading, setShareLoading] = useState(false)
const [shareSuccess, setShareSuccess] = useState(false)
const [shareError, setShareError] = useState(null)
```

Add the share handler:

```js
const handleShare = async () => {
  if (!shareTitle.trim()) return
  setShareLoading(true)
  setShareError(null)
  try {
    await onShareExam(shareTitle.trim())
    setShareSuccess(true)
    setShowShareModal(false)
    setShareTitle('')
  } catch (err) {
    setShareError(err.message || 'Failed to share exam')
  } finally {
    setShareLoading(false)
  }
}
```

In the `results-actions` div (currently at line 300), add after the existing buttons:

```jsx
{onShareExam && !shareSuccess && (
  <button className="btn-share-exam" onClick={() => setShowShareModal(true)}>
    Share Exam
  </button>
)}
{shareSuccess && (
  <span className="share-success-msg">Exam shared! Find it in the Exams tab.</span>
)}

{showShareModal && (
  <div className="share-modal-overlay">
    <div className="share-modal">
      <div className="share-modal-title">Share This Exam</div>
      <p className="share-modal-desc">Give your exam a name so others can find it.</p>
      <input
        className="share-modal-input"
        type="text"
        placeholder="Exam title..."
        value={shareTitle}
        onChange={e => setShareTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleShare()}
        maxLength={255}
        autoFocus
      />
      {shareError && <div className="share-modal-error">{shareError}</div>}
      <div className="share-modal-actions">
        <button className="btn-share-cancel" onClick={() => setShowShareModal(false)}>
          Cancel
        </button>
        <button
          className="btn-share-confirm"
          onClick={handleShare}
          disabled={!shareTitle.trim() || shareLoading}
        >
          {shareLoading ? 'Sharing...' : 'Share'}
        </button>
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 2: Wire `onShareExam` in `PracticeScreen.jsx`**

In `PracticeScreen.jsx`, add a `handleShareExam` callback after the existing `restart` callback:

```js
const handleShareExam = useCallback(async (title) => {
  await api.createSharedExam({
    title,
    question_ids: quizQuestions.map(q => q.id),
    time_limit_minutes: timeLimit > 0 ? timeLimit : null,
    domains_selected: selectedDomains,
  })
}, [quizQuestions, timeLimit, selectedDomains])
```

In the JSX where `ResultsScreen` is rendered (around line 483), add the `onShareExam` prop. Pass it only when `user` is logged in:

```jsx
{phase === 'results' && (
  <ResultsScreen
    questions={quizQuestions}
    answers={answers}
    domains={domains}
    examStatus={examStatus}
    onRestart={restart}
    onRetryWrong={retryWrongQuestions}
    onShareExam={user ? handleShareExam : null}
  />
)}
```

- [ ] **Step 3: Add CSS for share modal and button**

In `quiz-app/src/App.css` (or the relevant CSS file), add:

```css
.btn-share-exam {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-share-exam:hover { opacity: 0.85; }

.share-success-msg {
  color: #10b981;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0;
}

.share-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.share-modal {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 420px;
}
.share-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}
.share-modal-desc {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.share-modal-input {
  width: 100%;
  background: #0f172a;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  color: #f1f5f9;
  font-size: 0.95rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
}
.share-modal-input:focus { outline: none; border-color: #6366f1; }
.share-modal-error { color: #f87171; font-size: 0.85rem; margin-bottom: 0.5rem; }
.share-modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
.btn-share-cancel {
  background: transparent;
  border: 1px solid #475569;
  color: #94a3b8;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
}
.btn-share-cancel:hover { border-color: #94a3b8; color: #f1f5f9; }
.btn-share-confirm {
  background: #6366f1;
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-share-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-share-confirm:not(:disabled):hover { background: #4f46e5; }
```

- [ ] **Step 4: Test manually**

Start the dev server (`cd quiz-app && npm run dev`), complete a practice exam while logged in, verify the "Share Exam" button appears, enter a title, and click Share. Confirm the success message appears. Verify the button does NOT appear when logged out.

- [ ] **Step 5: Commit**

```bash
git add quiz-app/src/components/ResultsScreen.jsx quiz-app/src/components/PracticeScreen.jsx quiz-app/src/App.css
git commit -m "feat: add Share Exam button and modal to ResultsScreen"
```

---

### Task 10: Create ExamsScreen

**Files:**
- Create: `quiz-app/src/components/ExamsScreen.jsx`

- [ ] **Step 1: Create `quiz-app/src/components/ExamsScreen.jsx`**

```jsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { mapQuestionKeys, prepareQuestionsForQuiz } from '../utils'
import QuizScreen from './QuizScreen'
import ResultsScreen from './ResultsScreen'

export default function ExamsScreen({ domains, onProgressChange, onQuizActiveChange, onLeaveCallbackRef }) {
  const { user } = useAuth()
  const [phase, setPhase] = useState('list')
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeExam, setActiveExam] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [examStatus, setExamStatus] = useState('completed')
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [loadingExam, setLoadingExam] = useState(false)
  const timerRef = useRef(null)
  const finishExamRef = useRef(false)
  const finishExamFnRef = useRef(null)

  useEffect(() => {
    api.getSharedExams()
      .then(setExams)
      .catch(err => console.error('Failed to load shared exams:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    onQuizActiveChange?.(phase === 'quiz')
    if (onLeaveCallbackRef) {
      onLeaveCallbackRef.current = phase === 'quiz' ? () => setExamStatus('abandoned') : null
    }
    return () => {
      onQuizActiveChange?.(false)
      if (onLeaveCallbackRef) onLeaveCallbackRef.current = null
    }
  }, [phase, onQuizActiveChange, onLeaveCallbackRef])

  const timerActive = phase === 'quiz' && remainingSeconds !== null && remainingSeconds > 0
  useEffect(() => {
    if (!timerActive) return
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timerActive])

  useEffect(() => {
    if (remainingSeconds === 0 && phase === 'quiz') setExamStatus('timed_out')
  }, [remainingSeconds, phase])

  useEffect(() => {
    if ((examStatus === 'timed_out' || examStatus === 'abandoned') && phase === 'quiz' && !finishExamRef.current) {
      finishExamRef.current = true
      finishExamFnRef.current?.(examStatus)
    }
  }, [examStatus, phase])

  const answeredCount = Object.values(answers).filter(a => a.confirmed).length
  const formatTime = (secs) => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`

  useEffect(() => {
    if (phase === 'quiz') {
      const timerText = remainingSeconds !== null ? ` | ${formatTime(remainingSeconds)}` : ''
      onProgressChange?.(`${answeredCount} / ${quizQuestions.length} answered${timerText}`)
    } else {
      onProgressChange?.(null)
    }
    return () => onProgressChange?.(null)
  }, [phase, answeredCount, quizQuestions.length, remainingSeconds, onProgressChange])

  const startExam = useCallback(async (exam) => {
    setLoadingExam(true)
    try {
      const detail = await api.getSharedExam(exam.id)
      const mapped = detail.questions.map(q => mapQuestionKeys(q))
      const prepared = prepareQuestionsForQuiz(mapped)
      setActiveExam(detail)
      setQuizQuestions(prepared)
      setCurrentIndex(0)
      setAnswers({})
      setShowExplanation(false)
      setExamStatus('in_progress')
      finishExamRef.current = false
      setRemainingSeconds(detail.time_limit_minutes ? detail.time_limit_minutes * 60 : null)
      setPhase('quiz')
    } catch (err) {
      console.error('Failed to load exam:', err)
    } finally {
      setLoadingExam(false)
    }
  }, [])

  const submitExamResults = useCallback(async (status = 'completed') => {
    if (!user || !activeExam) return
    const answersList = quizQuestions.map(q => {
      const ans = answers[q.id]
      return {
        question_id: q.id,
        domain_id: q.domainId,
        selected_answer: ans?.selected || '',
        correct_answer: q.correctAnswer,
        is_correct: ans?.confirmed && ans?.selected === q.correctAnswer,
      }
    })
    const correct = answersList.filter(a => a.is_correct).length
    const pct = Math.round((correct / quizQuestions.length) * 100)
    const score = Math.round(100 + (pct / 100) * 900)
    try {
      await api.submitExam({
        total_questions: quizQuestions.length,
        correct_count: correct,
        score,
        passed: score >= 720,
        domains_selected: activeExam.domains_selected,
        time_limit_minutes: activeExam.time_limit_minutes || null,
        status,
        answers: answersList,
        shared_exam_id: activeExam.id,
      })
    } catch (err) {
      console.error('Failed to save exam results:', err)
    }
  }, [user, activeExam, quizQuestions, answers])

  const finishExam = useCallback((status) => {
    clearInterval(timerRef.current)
    submitExamResults(status)
    setPhase('results')
  }, [submitExamResults])

  finishExamFnRef.current = finishExam

  const selectAnswer = useCallback((questionId, optionId) => {
    if (answers[questionId]?.confirmed) return
    setAnswers(prev => ({ ...prev, [questionId]: { selected: optionId, confirmed: false } }))
  }, [answers])

  const confirmAnswer = useCallback((questionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: { ...prev[questionId], confirmed: true } }))
    setShowExplanation(true)
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowExplanation(false)
    } else {
      finishExam('completed')
    }
  }, [currentIndex, quizQuestions.length, finishExam])

  const backToList = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('list')
    setActiveExam(null)
    setQuizQuestions([])
    setAnswers({})
    setCurrentIndex(0)
    setRemainingSeconds(null)
    setExamStatus('completed')
    finishExamRef.current = false
  }, [])

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <div className="loading-spinner" />
        <span style={{ marginLeft: 12, color: '#94a3b8' }}>Loading exams...</span>
      </div>
    )
  }

  return (
    <div className="main-content">
      {phase === 'list' && (
        <div className="exams-screen">
          <h2 className="exams-title">Shared Exams</h2>
          <p className="exams-subtitle">Community-created exams. Take any exam to practice with the exact same questions.</p>
          {exams.length === 0 ? (
            <div className="exams-empty">
              No shared exams yet. Complete a practice session and click &ldquo;Share Exam&rdquo; to create one!
            </div>
          ) : (
            <div className="exams-list">
              {exams.map(exam => (
                <div key={exam.id} className="exam-card">
                  <div className="exam-card-body">
                    <div className="exam-card-title">{exam.title}</div>
                    <div className="exam-card-meta">
                      <span className="exam-card-creator">by {exam.creator_username}</span>
                      <span className="exam-card-sep">·</span>
                      <span>{exam.question_count} questions</span>
                      {exam.time_limit_minutes && (
                        <>
                          <span className="exam-card-sep">·</span>
                          <span>{exam.time_limit_minutes} min</span>
                        </>
                      )}
                      <span className="exam-card-sep">·</span>
                      <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    className="btn-take-exam"
                    onClick={() => user ? startExam(exam) : alert('Please sign in to take an exam.')}
                    disabled={loadingExam}
                  >
                    {loadingExam ? 'Loading...' : 'Take Exam'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {phase === 'quiz' && quizQuestions.length > 0 && (
        <QuizScreen
          question={quizQuestions[currentIndex]}
          currentIndex={currentIndex}
          total={quizQuestions.length}
          answer={answers[quizQuestions[currentIndex].id]}
          showExplanation={showExplanation}
          onSelect={selectAnswer}
          onConfirm={confirmAnswer}
          onNext={nextQuestion}
          isLast={currentIndex === quizQuestions.length - 1}
          remainingSeconds={remainingSeconds}
          formatTime={formatTime}
        />
      )}

      {phase === 'results' && (
        <ResultsScreen
          questions={quizQuestions}
          answers={answers}
          domains={domains}
          examStatus={examStatus}
          onRestart={backToList}
        />
      )}

      {showLeaveDialog && (
        <div className="leave-dialog-overlay">
          <div className="leave-dialog">
            <div className="leave-dialog-title">Exam in Progress</div>
            <p className="leave-dialog-text">
              You have an exam in progress. Leaving will end the exam and unanswered questions will be scored as incorrect. Are you sure?
            </p>
            <div className="leave-dialog-actions">
              <button className="btn-leave-cancel" onClick={() => setShowLeaveDialog(false)}>Continue Exam</button>
              <button className="btn-leave-confirm" onClick={() => { setShowLeaveDialog(false); setExamStatus('abandoned') }}>Leave &amp; Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add CSS for the Exams list screen**

In `quiz-app/src/App.css`, add:

```css
.exams-screen {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.exams-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}
.exams-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}
.exams-empty {
  text-align: center;
  color: #64748b;
  padding: 3rem 1rem;
  font-size: 0.95rem;
}
.exams-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.exam-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.exam-card-body { flex: 1; }
.exam-card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 0.4rem;
}
.exam-card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #64748b;
  flex-wrap: wrap;
}
.exam-card-creator { color: #94a3b8; }
.exam-card-sep { color: #475569; }
.btn-take-exam {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.btn-take-exam:hover:not(:disabled) { background: #4f46e5; }
.btn-take-exam:disabled { opacity: 0.5; cursor: not-allowed; }
```

- [ ] **Step 3: Commit**

```bash
git add quiz-app/src/components/ExamsScreen.jsx quiz-app/src/App.css
git commit -m "feat: add ExamsScreen with list and take-exam flow"
```

---

### Task 11: Add Exams tab to App.jsx

**Files:**
- Modify: `quiz-app/src/App.jsx`

- [ ] **Step 1: Update `quiz-app/src/App.jsx`**

Add the import at the top (after `FlashcardsScreen`):

```js
import ExamsScreen from './components/ExamsScreen'
```

In the `navTabs` array (currently 5 items), add the Exams tab after Flashcards:

```js
const navTabs = [
  { to: '/learn', label: 'Learn' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/practice', label: 'Practice' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/exams', label: 'Exams' },
  { to: '/performance', label: 'Performance' },
]
```

In the `<Routes>` block, add the `/exams` route after `/flashcards`:

```jsx
<Route
  path="/exams"
  element={
    <ExamsScreen
      domains={DOMAINS}
      onProgressChange={setQuizProgress}
      onQuizActiveChange={setQuizActive}
      onLeaveCallbackRef={leaveCallbackRef}
    />
  }
/>
```

- [ ] **Step 2: Manual end-to-end test**

1. Start the dev server: `cd quiz-app && npm run dev`
2. Navigate to the **Exams** tab — verify it loads (empty state).
3. Go to **Practice**, complete a short exam while logged in.
4. On the ResultsScreen, click **Share Exam**, enter a title, click Share.
5. Navigate to **Exams** tab — verify the shared exam card appears with correct title, creator username, question count.
6. Click **Take Exam** — verify the quiz launches with the same questions.
7. Complete the exam — verify the ResultsScreen shows results (no "Share Exam" button).
8. Log out — verify the "Share Exam" button is gone on Practice results.
9. Verify clicking "Take Exam" while logged out shows a sign-in prompt.

- [ ] **Step 3: Commit**

```bash
git add quiz-app/src/App.jsx
git commit -m "feat: add Exams tab and route to App.jsx"
```

---

## Self-Review

**Spec coverage check:**
- ✅ New "Exams" tab → Task 11
- ✅ "Share Exam" button on ResultsScreen → Task 9
- ✅ Button hidden on shared exam results → `onShareExam` not passed from ExamsScreen's ResultsScreen render
- ✅ Button only for logged-in users → `user ? handleShareExam : null`
- ✅ Shared exam captures exact question IDs → `question_ids: quizQuestions.map(q => q.id)`
- ✅ Questions served in original order → `GET /shared-exams/{id}` reorders by `question_ids`
- ✅ Public list with creator username → `SharedExamSummary.creator_username`
- ✅ All users can browse without auth → `list_shared_exams` has no auth dependency
- ✅ `shared_exam_id` stored on attempt → Task 6
- ✅ DB migration → Task 1

**Type consistency check:**
- `SharedExamSummary` uses `creator_username` — matches router's `_to_summary()` output ✅
- `SharedExamDetail.questions` is `list[QuestionResponse]` — matches `QuestionResponse.model_validate(q)` ✅
- `prepareQuestionsForQuiz` defined in `utils.js` used in both `PracticeScreen` and `ExamsScreen` ✅
- `onShareExam` prop: `ResultsScreen` declares it as `onShareExam = null`, `PracticeScreen` passes `user ? handleShareExam : null` ✅
- `ExamsScreen` passes `onShareExam={undefined}` implicitly to `ResultsScreen` (not passed at all) → no Share button on shared exam results ✅
