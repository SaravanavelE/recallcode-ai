from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..core.database import get_db
from ..models import database_models, pydantic_schemas
from ..memory.hindsight import HindsightMemory

router = APIRouter()

@router.get("/{user_id}", response_model=List[pydantic_schemas.MemoryEntry])
def list_memories(user_id: int, db: Session = Depends(get_db)):
    return db.query(database_models.MemoryEntry).filter(
        database_models.MemoryEntry.user_id == user_id
    ).order_by(database_models.MemoryEntry.timestamp.desc()).all()

@router.get("/summary/{user_id}")
async def get_summary(user_id: int, db: Session = Depends(get_db)):
    summary = HindsightMemory.get_user_profile_summary(db, user_id)
    
    # Also get some stats
    sessions = db.query(database_models.Session).filter(database_models.Session.user_id == user_id).count()
    completed = db.query(database_models.Session).filter(
        database_models.Session.user_id == user_id, 
        database_models.Session.status == "completed"
    ).count()
    
    return {
        "summary": summary,
        "total_sessions": sessions,
        "completed_sessions": completed,
        "improvement_rate": (completed / sessions) if sessions > 0 else 0
    }
