import json
import os
from app.database import SessionLocal, engine
from app.models import Base, Question, LearnTopic

SEEDS_DIR = os.path.join(os.path.dirname(__file__), "seeds")

JSON_FIELDS_QUESTION = ["options", "why_others_wrong", "doc_reference", "skilljar_ref", "course_keys"]
JSON_FIELDS_TOPIC = ["related_topics", "skilljar_refs", "anthropic_docs_ref", "key_concepts", "optional_in"]


def ensure_parsed(record, json_fields):
    """Ensure JSON fields are Python objects, not strings."""
    for field in json_fields:
        val = record.get(field)
        if isinstance(val, str):
            try:
                record[field] = json.loads(val)
            except (json.JSONDecodeError, TypeError):
                pass
    # Fix datetime format for MySQL
    if "updated_at" in record and isinstance(record["updated_at"], str):
        record["updated_at"] = record["updated_at"].replace("T", " ").replace("Z", "")
    return record


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Clear old data
        print("Clearing old data...")
        db.query(Question).delete()
        db.query(LearnTopic).delete()
        db.commit()

        # Seed questions
        with open(os.path.join(SEEDS_DIR, "questions.json"), encoding="utf-8") as f:
            questions = json.load(f)

        print(f"Seeding {len(questions)} questions...")
        for q in questions:
            ensure_parsed(q, JSON_FIELDS_QUESTION)
            db.add(Question(**q))

        db.flush()

        # Seed topics
        with open(os.path.join(SEEDS_DIR, "learn_topics.json"), encoding="utf-8") as f:
            topics = json.load(f)

        print(f"Seeding {len(topics)} topics...")
        for t in topics:
            ensure_parsed(t, JSON_FIELDS_TOPIC)
            db.add(LearnTopic(**t))

        db.commit()
        print("Seeding complete!")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
