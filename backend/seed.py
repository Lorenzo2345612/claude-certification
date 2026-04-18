import json
import os
from sqlalchemy import text
from app.database import SessionLocal, engine
from app.models import Base, Question, LearnTopic

SEEDS_DIR = os.path.join(os.path.dirname(__file__), "seeds")


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
            db.add(Question(**q))

        db.flush()

        # Seed topics
        with open(os.path.join(SEEDS_DIR, "learn_topics.json"), encoding="utf-8") as f:
            topics = json.load(f)

        print(f"Seeding {len(topics)} topics...")
        for t in topics:
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
