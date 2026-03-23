from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    username: str
    preferred_language: str = "python"

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class MemoryEntryBase(BaseModel):
    category: str
    content: str
    topic: Optional[str] = None
    language: Optional[str] = None
    importance: float = 0.5
    session_id: Optional[int] = None

class MemoryEntry(MemoryEntryBase):
    id: int
    user_id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    user_id: int
    problem_id: int
    language: str

class Session(BaseModel):
    id: int
    user_id: int
    problem_id: int
    status: str
    language: str
    reflection_summary: Optional[str] = None
    timestamp: datetime
    class Config:
        from_attributes = True

class PracticeProblem(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: str
    description: str
    base_code: str
    test_cases: List[Dict[str, Any]]
    class Config:
        from_attributes = True

class CodeSubmission(BaseModel):
    user_id: int
    session_id: int
    code: str

class HintRequest(BaseModel):
    user_id: int
    session_id: int
    current_code: str

class ReflectionResult(BaseModel):
    correctness: bool
    mistake_patterns: List[str]
    reflection: str
    new_memories: List[MemoryEntryBase]
