from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .config import get_settings
from .database import engine, Base
from .routers import auth_router, notes_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Wait for MySQL and create tables
    import time
    for attempt in range(30):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except Exception:
            time.sleep(2)
    Base.metadata.create_all(bind=engine)
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


@app.get("/api/health")
def health():
    return {"status": "ok"}
