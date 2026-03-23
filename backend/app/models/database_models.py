from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    preferred_language = Column(String, default="python")
    
    memories = relationship("MemoryEntry", back_populates="owner")
    sessions = relationship("Session", back_populates="user")

class MemoryEntry(Base):
    __tablename__ = "memories"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String, index=True) # mistake_pattern, preference
    content = Column(Text)
    topic = Column(String, nullable=True)
    language = Column(String, nullable=True)
    importance = Column(Float, default=0.5)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    owner = relationship("User", back_populates="memories")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    status = Column(String, default="started") # started, completed, struggled
    language = Column(String)
    session_log = Column(JSON, nullable=True) # List of actions
    reflection_summary = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="sessions")
    problem = relationship("PracticeProblem", back_populates="sessions")

class PracticeProblem(Base):
    __tablename__ = "problems"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    topic = Column(String)
    difficulty = Column(String)
    description = Column(Text)
    base_code = Column(Text)
    test_cases = Column(JSON) # [{'input': '...', 'expected': '...'}]
    
    sessions = relationship("Session", back_populates="problem")
