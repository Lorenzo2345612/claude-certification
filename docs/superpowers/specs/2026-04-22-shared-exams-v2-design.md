# Shared Exams v2: Share From StartScreen + Pagination

**Date:** 2026-04-22
**Status:** Approved
**Supersedes nothing.** Extends `2026-04-21-shared-exams-design.md`.

## Overview

Two extensions to the Shared Exams feature:

1. **Share from the Practice start screen** — users can create a shared exam *before* taking it. Questions are locked at share time by applying the same filter+shuffle+slice logic used by "Start Exam".
2. **Paginate the shared exams list** — the existing flat array becomes a paginated response with 10 items per page.

The existing share-from-results flow is unchanged.

## Data Model

**No new columns.** The existing `shared_exams` schema captures everything needed — questions are locked in via `question_ids`, and `time_limit_minutes` + `domains_selected` cover the rest. Filter mode (domain vs scenario) is informational only and can be inferred from `domains_selected`.

## Backend

### Modified: `GET /api/shared-exams/`

**Breaking change** to response shape.

Query params:
- `page` (int, default `1`, min `1`)
- `page_size` (int, default `10`, min `1`, max `50`)

Response (new Pydantic schema `SharedExamListPage`):

```json
{
  "items": [ { ...SharedExamSummary } ],
  "total": 47,
  "page": 1,
  "page_size": 10,
  "total_pages": 5
}
```

- Ordered by `created_at DESC`
- Eager-loads `creator` (preserves the N+1 fix from v1)
- Returns empty `items` with `total: 0, total_pages: 0` when no exams exist
- Invalid `page` beyond `total_pages` → returns empty `items` (not 404) so clients can safely overshoot

### New Pydantic schema

```python
class SharedExamListPage(BaseModel):
    items: list[SharedExamSummary]
    total: int
    page: int
    page_size: int
    total_pages: int
```

### Other endpoints unchanged

`POST /api/shared-exams/` and `GET /api/shared-exams/{id}` are untouched.

## Frontend

### New component: `quiz-app/src/components/ShareExamModal.jsx`

Extracts the share modal JSX currently duplicated inline in `ResultsScreen.jsx`. Props:

- `onShare(title)` — async callback
- `onClose()` — dismiss handler
- `open` (bool) — controls rendering

Internally manages `title`, `loading`, `error`. On successful share, calls `onClose`. The success message is rendered by the *parent* (so it can live outside the modal lifecycle).

### Modified: `quiz-app/src/components/ResultsScreen.jsx`

Replace the inline share modal JSX with `<ShareExamModal />`. Keep the "Share Exam" button, success message, and state machine in place. This is a pure refactor — no behavior change.

### Modified: `quiz-app/src/components/StartScreen.jsx`

Add a "Share Exam" secondary button next to "Start Exam":

- Visible only when the user is logged in and `availableCount > 0`
- Disabled when `questionCount > availableCount`
- Click → opens the ShareExamModal
- On share → selects questions via the same filter+shuffle logic used by `startQuiz`, then calls `onShareExam({ title, question_ids, time_limit_minutes, domains_selected })`

The actual "pick random questions and POST" logic lives in `PracticeScreen` (not `StartScreen`), since `StartScreen` doesn't have direct access to the question pool. `StartScreen` receives an `onShareExam` prop from `PracticeScreen`.

### Modified: `quiz-app/src/components/PracticeScreen.jsx`

Add a new `handleShareExamFromStart(title)` callback. It runs the same filter+shuffle logic as `startQuiz` (without entering the quiz phase), takes the first `questionCount` questions, maps their IDs, and calls `api.createSharedExam(...)`:

```js
const handleShareExamFromStart = useCallback(async (title) => {
  const pool = filterMode === 'scenario'
    ? questions.filter(q => selectedScenarios.includes(q.scenario))
    : questions.filter(q => selectedDomains.includes(q.domainId))
  const filtered = onlyUnanswered ? pool.filter(q => !answeredIds.has(q.id)) : pool
  const shuffled = shuffleArray(filtered).slice(0, questionCount)
  await api.createSharedExam({
    title,
    question_ids: shuffled.map(q => q.id),
    time_limit_minutes: timeLimit > 0 ? timeLimit : null,
    domains_selected: selectedDomains,
  })
}, [questions, filterMode, selectedDomains, selectedScenarios, onlyUnanswered, answeredIds, questionCount, timeLimit])
```

Passed to `StartScreen` as `onShareExam={user ? handleShareExamFromStart : null}`. The existing `handleShareExam` on ResultsScreen is unchanged.

### Modified: `quiz-app/src/components/ExamsScreen.jsx`

- Add `page` state (default `1`)
- Add `pagination` state holding `{ total, page, page_size, total_pages }`
- `api.getSharedExams(page)` returns the new page shape
- Render pagination controls below the list:
  - `← Prev` button — disabled when `page <= 1`
  - `Page X of Y` indicator
  - `Next →` button — disabled when `page >= total_pages`
- Hide pagination UI when `total_pages <= 1`
- When the user takes an exam and returns to the list, stay on the current page

### Modified: `quiz-app/src/api.js`

```js
getSharedExams(page = 1, pageSize = 10) {
  return request(`/shared-exams/?page=${page}&page_size=${pageSize}`)
},
```

## Data Flow

```
[StartScreen] → "Share Exam" → ShareExamModal (title input)
    → handleShareExamFromStart picks N random questions from filters
    → POST /api/shared-exams/ → SharedExam saved
    → success message on StartScreen

[ExamsScreen] → GET /api/shared-exams/?page=1 → page 1 of exams
    → user clicks "Next" → page=2 fetched
    → "Take Exam" unchanged from v1
```

## Testing

### Backend (extend `backend/tests/test_shared_exams.py`)

Add 4 new tests:

1. `test_list_shared_exams_paginated` — create 15 exams, request `page=1&page_size=10`, assert `total=15, total_pages=2, len(items)=10`
2. `test_list_shared_exams_second_page` — same 15 exams, `page=2`, assert `len(items)=5, page=2`
3. `test_list_shared_exams_page_beyond_total` — `page=99`, assert `200 OK`, empty `items`, `total=0` or proper total with empty items
4. `test_list_shared_exams_invalid_page_size` — `page_size=1000` rejected (422) or clamped to 50

Existing `test_list_shared_exams_is_public` updates to assert the new response shape (`data["items"]` instead of `data` directly).

### Frontend

No frontend tests exist in this project. Manual verification via dev server.

## Migration / Compatibility

- **Breaking API change**: `GET /api/shared-exams/` response shape changes from `[...]` to `{ items: [...], ... }`. Since the frontend and backend are deployed together, this is coordinated — no migration window needed.
- **No DB schema change.**
- **No data migration needed.**

## Out of Scope

- Sort options (always by `created_at DESC`)
- Search/filter on the exams list
- Per-user filtering (e.g., "my exams only")
- Infinite scroll (using explicit pagination instead)
- Creator edit/delete of shared exams (still deferred from v1)
