from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models import database_models, pydantic_schemas
from ..mentoring.mentor_engine import MentorEngine
import json

router = APIRouter()

@router.post("/start", response_model=pydantic_schemas.Session)
def start_session(data: pydantic_schemas.SessionCreate, db: Session = Depends(get_db)):
    """
    Starts a coding practice session.
    """
    session = database_models.Session(
        user_id=data.user_id,
        problem_id=data.problem_id,
        language=data.language,
        status="started"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.post("/hint")
async def get_hint(data: pydantic_schemas.HintRequest, db: Session = Depends(get_db)):
    """
    Adaptive hint request.
    Uses Hindsight profile to customize the nudge.
    """
    hint = MentorEngine.get_memory_aware_hint(
        db=db,
        user_id=data.user_id,
        session_id=data.session_id,
        current_code=data.current_code
    )
    return {"hint": hint}

@router.post("/submit")
async def submit_code(data: pydantic_schemas.CodeSubmission, db: Session = Depends(get_db)):
    """
    Code submission and reflection loop.
    Extracts new behavioral insights into Hindsight.
    """
    analysis = MentorEngine.analyze_and_reflect(
        db=db,
        user_id=data.user_id,
        session_id=data.session_id,
        code=data.code
    )
    return analysis
