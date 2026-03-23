from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models import database_models, pydantic_schemas

router = APIRouter()

@router.post("/login", response_model=pydantic_schemas.User)
def login(user_data: pydantic_schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Mock login: returns existing user or creates a new one.
    """
    db_user = db.query(database_models.User).filter(database_models.User.username == user_data.username).first()
    if not db_user:
        db_user = database_models.User(
            username=user_data.username,
            preferred_language=user_data.preferred_language
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    return db_user

@router.get("/me/{user_id}", response_model=pydantic_schemas.User)
def get_me(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
