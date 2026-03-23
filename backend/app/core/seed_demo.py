from sqlalchemy.orm import Session
from .database import SessionLocal, init_db
from ..models import database_models
import datetime

def seed_demo_data():
    db = SessionLocal()
    init_db()
    
    # 1. Create Demo User
    user = db.query(database_models.User).filter(database_models.User.username == "demo_student").first()
    if not user:
        user = database_models.User(username="demo_student", preferred_language="python")
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # 2. Add Hindsight Memories
    memories = [
        {
            "category": "mistake_pattern",
            "content": "Frequent off-by-one errors in array indexing and loops.",
            "topic": "Arrays",
            "importance": 0.8
        },
        {
            "category": "hint_preference",
            "content": "Prefers concrete examples before being given conceptual hints or pseudocode.",
            "topic": "General",
            "importance": 0.9
        },
        {
            "category": "weak_topic",
            "content": "Struggles to identify base cases in recursive Fibonacci and factorial problems.",
            "topic": "Recursion",
            "importance": 0.7
        },
        {
            "category": "success_strategy",
            "content": "Performs better when prompted to 'dry-run' with a small input like [1, 2] first.",
            "topic": "General",
            "importance": 0.6
        }
    ]
    
    for m in memories:
        # Check if already exists
        exists = db.query(database_models.MemoryEntry).filter(
            database_models.MemoryEntry.user_id == user.id,
            database_models.MemoryEntry.content == m["content"]
        ).first()
        if not exists:
            db_m = database_models.MemoryEntry(
                user_id=user.id,
                category=m["category"],
                content=m["content"],
                topic=m["topic"],
                importance=m["importance"],
                timestamp=datetime.datetime.utcnow()
            )
            db.add(db_m)
            
    db.commit()
    print("Demo data seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_demo_data()
