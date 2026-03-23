from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .core.database import init_db, get_db
from .models import database_models, pydantic_schemas
from .api import auth, problems, session, memory
import uvicorn

app = FastAPI(title="RecallCode API", description="AI Coding Practice Mentor with Memory")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to RecallCode API", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(problems.router, prefix="/problems", tags=["problems"])
app.include_router(session.router, prefix="/session", tags=["session"])
app.include_router(memory.router, prefix="/memory", tags=["memory"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
