from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlmodel import SQLModel

from app.database import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Triggers table creation
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}