from sqlmodel import Session, create_engine

from app.config import settings

# MySQL configuration
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    pool_pre_ping=True
)

def get_session():
    with Session(engine) as session:
        yield session