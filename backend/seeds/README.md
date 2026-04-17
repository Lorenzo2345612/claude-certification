# Seed Data Management

Questions and learn topics are stored in the database and populated via seeders that perform upserts (safe to re-run).

## Files

- `questions.json` — All quiz questions (319+), keyed by numeric `id`
- `learn_topics.json` — All learn topics (36+), keyed by string `id` (e.g., `"d1-agentic-loop"`)
- `../seed.py` — Seeder script that reads both JSON files and upserts into PostgreSQL

## Running the Seeder

```bash
cd backend
python seed.py
```

The seeder uses MySQL `ON DUPLICATE KEY UPDATE`, so:
- New records are inserted
- Existing records (by `id`) are updated with the latest data
- Records in the DB but NOT in the JSON are **not deleted** (see "Removing" below)

## Adding a New Question

1. Open `questions.json`
2. Add a new object to the array with the next sequential `id`:
   ```json
   {
     "id": 320,
     "domain_id": 1,
     "domain": "Agentic Architecture & Orchestration",
     "scenario": "Your scenario description",
     "question": "The question text?",
     "options": [
       {"id": "a", "text": "Option A", "correct": false},
       {"id": "b", "text": "Option B", "correct": true},
       {"id": "c", "text": "Option C", "correct": false},
       {"id": "d", "text": "Option D", "correct": false}
     ],
     "correct_answer": "b",
     "explanation": "Why B is correct...",
     "why_others_wrong": {
       "a": "Why A is wrong...",
       "c": "Why C is wrong...",
       "d": "Why D is wrong..."
     },
     "doc_reference": {"source": "Anthropic Docs", "quote": "Relevant quote..."},
     "doc_status": "STRONG",
     "skilljar_ref": {"course": "Course Name", "lesson": "Lesson Name", "url": "https://..."}
   }
   ```
3. Run `python seed.py`

## Adding a New Learn Topic

1. Open `learn_topics.json`
2. Add a new object with a unique string `id` following the pattern `d{domain_id}-slug`:
   ```json
   {
     "id": "d1-new-topic",
     "domain_id": 1,
     "domain": "Agentic Architecture & Orchestration",
     "title": "New Topic Title",
     "content": "<h3>Section Title</h3><p>HTML content here...</p>",
     "doc_url": "https://docs.anthropic.com/...",
     "doc_label": "Read Documentation",
     "related_topics": ["d1-agentic-loop", "d1-tool-use-contract"],
     "skilljar_refs": null,
     "anthropic_docs_ref": null,
     "summary": "One-paragraph summary of the topic.",
     "key_concepts": [
       {"term": "Concept Name", "definition": "What it means"}
     ]
   }
   ```
3. Run `python seed.py`
4. If the new topic should appear in the roadmap DAG, add prerequisite edges in `quiz-app/src/components/RoadmapScreen.jsx` in the `PREREQUISITE_EDGES` array

## Removing a Question

1. Delete the question object from `questions.json`
2. Run this SQL to remove it from the database:
   ```sql
   DELETE FROM questions WHERE id = <question_id>;
   ```
   Or add a cleanup step: after seeding, delete any DB records whose IDs are not in the JSON.

## Removing a Learn Topic

1. Delete the topic object from `learn_topics.json`
2. Remove any references to its `id` from other topics' `related_topics` arrays
3. Remove any prerequisite edges referencing it in `RoadmapScreen.jsx`
4. Run this SQL:
   ```sql
   DELETE FROM learn_topics WHERE id = '<topic_id>';
   DELETE FROM notes WHERE topic_id = '<topic_id>';
   DELETE FROM progress WHERE topic_id = '<topic_id>';
   ```

## Regenerating Seed JSON from Frontend JS Files

If the frontend JS data files are updated directly (legacy workflow), regenerate the seed JSON:

```bash
node scripts/convert-data.cjs
```

This reads `quiz-app/src/data/questions*.js`, `learnTopics.js`, and `learnSummaries.js`, then writes updated `questions.json` and `learn_topics.json`.

## Field Reference

### Question Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | int | Yes | Unique numeric ID (predefined, no autoincrement) |
| domain_id | int | Yes | Domain number (1-5) |
| domain | string | Yes | Domain full name |
| scenario | string | No | Scenario title shown above question |
| question | string | Yes | The question text |
| options | array | Yes | Array of `{id, text, correct}` objects |
| correct_answer | string | Yes | Letter ID of correct option (a/b/c/d) |
| explanation | string | No | Why the correct answer is correct |
| why_others_wrong | object | No | Map of option ID → explanation |
| doc_reference | object | No | `{source, quote}` from official docs |
| doc_status | string | No | STRONG, PARTIAL, or EXAM_GUIDE |
| skilljar_ref | object | No | `{course, lesson, url}` Skilljar reference |

### Learn Topic Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique slug like `d1-agentic-loop` |
| domain_id | int | Yes | Domain number (1-5) |
| domain | string | Yes | Domain full name |
| title | string | Yes | Display title |
| content | string | Yes | HTML content for the topic page |
| doc_url | string | No | Link to official documentation |
| doc_label | string | No | Label for the doc link button |
| related_topics | array | No | Array of related topic ID strings |
| summary | string | No | One-paragraph summary |
| key_concepts | array | No | Array of `{term, definition}` objects |
| skilljar_refs | array | No | Skilljar lesson references |
| anthropic_docs_ref | any | No | Anthropic docs reference |
