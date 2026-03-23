from sqlalchemy.orm import Session
from ..models import database_models, pydantic_schemas
from datetime import datetime
from typing import List

class HindsightMemory:
    """
    Manages the core Hindsight memory layer for RECALLCODE.
    """
    
    @staticmethod
    def get_user_profile_summary(db: Session, user_id: int) -> str:
        """
        Retrieves the student's historical summary for LLM context injection.
        """
        memories = db.query(database_models.MemoryEntry).filter(
            database_models.MemoryEntry.user_id == user_id
        ).order_by(database_models.MemoryEntry.importance.desc()).limit(15).all()
        
        if not memories:
            return "This is a new student. No historical behavioral patterns yet."
            
        summary = "Student's Learning Profile & Behavioral Patterns (Hindsight):\n"
        for m in memories:
            summary += f"- [{m.category}] {m.content} (Topic: {m.topic or 'General'})\n"
        
        return summary

    @staticmethod
    def add_memory(db: Session, user_id: int, entry: pydantic_schemas.MemoryEntryBase):
        """
        Adds a new memory entry to the user's profile.
        """
        db_entry = database_models.MemoryEntry(
            user_id=user_id,
            category=entry.category,
            content=entry.content,
            topic=entry.topic,
            language=entry.language,
            importance=entry.importance,
            session_id=entry.session_id
        )
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return db_entry

    @staticmethod
    def get_relevant_memories(db: Session, user_id: int, topic: str = None) -> List[database_models.MemoryEntry]:
        """
        Retrieves ranked memories for the dashboard or specific problem context.
        """
        query = db.query(database_models.MemoryEntry).filter(
            database_models.MemoryEntry.user_id == user_id
        )
        if topic:
            query = query.filter(database_models.MemoryEntry.topic == topic)
            
        return query.order_by(database_models.MemoryEntry.importance.desc()).all()
