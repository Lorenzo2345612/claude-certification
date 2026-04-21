# Shared Exams Feature Design

**Date:** 2026-04-21  
**Status:** Approved

## Overview

Add a new "Exams" tab to the app where users can browse and take community-shared exams. A user creates a shared exam by completing a practice session and clicking "Share Exam" on the ResultsScreen. The shared exam captures the exact question set from that attempt and becomes visible to all users in the Exams tab.

## Data Models

### New table: `shared_exams`

| Column | Type | Notes |
|---|---|---|
| `id` | INT PK AUTO_INCREMENT | |
| `creator_id` | INT FK → users.id | |
| `title` | VARCHAR(255) NOT NULL | user-provided name |
| `question_ids` | JSON NOT NULL | ordered list of question IDs from the attempt |
| `time_limit_minutes` | INT NOT NULL | copied from original practice session |
| `domains_selected` | JSON NOT NULL | copied from original (for display) |
| `created_at` | DATETIME NOT NULL DEFAULT NOW() | |

### Modified table: `exam_attempts`

Add one nullable column:

| Column | Type | Notes |
|---|---|---|
| `shared_exam_id` | INT FK → shared_exams.id, NULLABLE | NULL = practice attempt; set = shared exam attempt |

No new attempt or answer tables — existing `ExamAttempt` and `ExamAnswer` infrastructure is reused.

## Backend

### New file: `backend/app/routers/shared_exams_router.py`

Prefix: `/shared-exams`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/` | required | Create a shared exam. Body: `{ title, question_ids, time_limit_minutes, domains_selected }`. Returns the created shared exam. |
| `GET` | `/` | optional | List all shared exams. Returns: id, title, creator username, question count, time_limit_minutes, domains_selected, created_at. |
| `GET` | `/{id}` | optional | Get a single shared exam with full question objects (for taking the exam). |

### Modified: `backend/app/routers/exams_router.py`

`POST /exams/` accepts an optional `shared_exam_id` field in the request body. If provided, the created `ExamAttempt` is linked to that shared exam.

### New Alembic migration: `0004_add_shared_exams.py`

1. Create `shared_exams` table.
2. Add nullable `shared_exam_id` FK column to `exam_attempts`.

### New Pydantic schemas (in `schemas.py`)

- `SharedExamCreate` — input for creating a shared exam
- `SharedExamSummary` — list view (no question objects)
- `SharedExamDetail` — full view with question objects for taking the exam

## Frontend

### New file: `frontend/src/screens/ExamsScreen.jsx`

- Fetches `GET /shared-exams/` on mount
- Renders a list of exam cards, each showing: title, creator username, question count, time limit, date created
- Each card has a "Take Exam" button
- If not logged in, "Take Exam" prompts login (consistent with practice behavior)

### Modified: `frontend/src/screens/ResultsScreen.jsx`

- Add "Share Exam" button in the results action area
- On click: opens a modal with a title input field and a "Share" confirm button
- On confirm: calls `POST /shared-exams/` with the question IDs from the current attempt, time limit, and domains
- On success: shows a brief confirmation message ("Exam shared! Find it in the Exams tab.")
- Auth required: button only visible to logged-in users
- "Share Exam" button is hidden when the results are from a shared exam attempt (to prevent duplicate shared exams)

### Modified: `frontend/src/App.jsx`

- Add `ExamsScreen` import and `/exams` route
- Add "Exams" NavLink to the navigation tab bar (6th tab, after Flashcards)

### New API calls in `frontend/src/api.js`

- `createSharedExam(data)` → `POST /shared-exams/`
- `getSharedExams()` → `GET /shared-exams/`
- `getSharedExam(id)` → `GET /shared-exams/{id}`

### Taking a shared exam

- `GET /shared-exams/{id}` returns the full question set
- The existing `QuizScreen` is launched with those questions (same props interface as practice)
- On submit, `POST /exams/` is called with the additional `shared_exam_id` field
- Results flow into the existing `ResultsScreen`

## Data Flow

```
[ResultsScreen] → "Share Exam" → modal (title input)
    → POST /shared-exams/ → SharedExam saved in DB
    → confirmation message

[ExamsScreen] → GET /shared-exams/ → exam card list
    → "Take Exam" → GET /shared-exams/{id} → questions loaded
    → QuizScreen (locked question set)
    → POST /exams/ (with shared_exam_id)
    → ResultsScreen
```

## Out of Scope

- Leaderboards or score comparisons between users
- Creator editing or deleting a shared exam after publishing
- Custom (user-written) questions — only existing question bank questions
- Filtering/searching shared exams (simple list for now)
