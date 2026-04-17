import json
import os
from sqlalchemy.dialects.mysql import insert
from app.database import SessionLocal, engine
from app.models import Base, Question, LearnTopic

SEEDS_DIR = os.path.join(os.path.dirname(__file__), "seeds")


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Seed questions
        with open(os.path.join(SEEDS_DIR, "questions.json"), encoding="utf-8") as f:
            questions = json.load(f)

        print(f"Seeding {len(questions)} questions...")
        for q in questions:
            stmt = insert(Question).values(**q)
            update_cols = {k: stmt.inserted[k] for k in q if k != "id"}
            stmt = stmt.on_duplicate_key_update(**update_cols)
            db.execute(stmt)

        # Seed topics
        with open(os.path.join(SEEDS_DIR, "learn_topics.json"), encoding="utf-8") as f:
            topics = json.load(f)

        print(f"Seeding {len(topics)} topics...")
        for t in topics:
            stmt = insert(LearnTopic).values(**t)
            update_cols = {k: stmt.inserted[k] for k in t if k != "id"}
            stmt = stmt.on_duplicate_key_update(**update_cols)
            db.execute(stmt)

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
