from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .config import get_settings
from .database import engine, Base
from .models import User, Note, Progress, Question, LearnTopic, ExamAttempt, ExamAnswer, FlashcardState, SharedExam  # noqa: F401
from .routers import auth_router, notes_router, progress_router, questions_router, topics_router, exams_router, flashcards_router, shared_exams_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    import os
    if not os.environ.get("TESTING"):
        import time
        for attempt in range(30):
            try:
                with engine.connect() as conn:
                    conn.execute(text("SELECT 1"))
                break
            except Exception:
                time.sleep(2)
        from alembic.config import Config
        from alembic import command
        from sqlalchemy import inspect
        import logging
        logger = logging.getLogger("alembic.startup")
        try:
            alembic_cfg = Config(os.path.join(os.path.dirname(os.path.dirname(__file__)), "alembic.ini"))
            alembic_cfg.set_main_option("sqlalchemy.url", str(engine.url))
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            if "alembic_version" not in tables and "users" in tables:
                logger.info("Existing DB detected without alembic_version — stamping at 0001")
                command.stamp(alembic_cfg, "0001")
            command.upgrade(alembic_cfg, "head")
            logger.info("Migrations completed successfully")
        except Exception as e:
            logger.error(f"Migration failed: {e}")
            Base.metadata.create_all(bind=engine)
            logger.info("Fell back to create_all")
    yield


app = FastAPI(
    title="Claude Architect Quiz API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(notes_router.router)
app.include_router(progress_router.router)
app.include_router(questions_router.router)
app.include_router(topics_router.router)
app.include_router(exams_router.router)
app.include_router(flashcards_router.router)
app.include_router(shared_exams_router.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "claude-architect-api"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
