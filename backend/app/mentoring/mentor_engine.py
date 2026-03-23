from sqlalchemy.orm import Session
from ..models import database_models, pydantic_schemas
from ..memory.hindsight import HindsightMemory
from ..core.llm_client import llm_client
import json

class MentorEngine:
    """
    Adaptive Coding Mentor Engine - Demo Ready V2
    """
    
    @staticmethod
    def get_memory_aware_hint(db: Session, user_id: int, session_id: int, current_code: str):
        # 1. Pull Hindsight Summary
        hindsight = HindsightMemory.get_user_profile_summary(db, user_id)
        
        # 2. Get Problem Context
        session = db.query(database_models.Session).filter(database_models.Session.id == session_id).first()
        problem = db.query(database_models.PracticeProblem).filter(database_models.PracticeProblem.id == session.problem_id).first()
        
        # 3. Memory-Aware Prompting
        system_prompt = f"""
        You are RECALLCODE, an AI Coding Mentor. Your unique superpower is HINDSIGHT.
        
        ### HINDSIGHT DATA (This is what you know about the student's past):
        {hindsight}
        
        ### CURRENT CHALLENGE:
        - Problem: {problem.title}
        - Topic: {problem.topic}
        - Problem Description: {problem.description}
        - Current Student Code: {current_code}
        
        ### MENTORING STYLE:
        1. CRITICAL: Never give the full solution.
        2. PERSONAL: Connect your advice to the student's *historical patterns* documented in Hindsight.
        3. ADAPTIVE: If they struggle with 'off-by-one', check their loop bounds. If they prefer 'examples', provide one.
        
        Provide a short, supportive nudge that reflects their history.
        """
        
        response = llm_client.chat_completion([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "I'm stuck. Can you give me a hint based on what you remember about my mistakes?"}
        ])
        
        return response

    @staticmethod
    def analyze_and_reflect(db: Session, user_id: int, session_id: int, code: str):
        # 1. Fetch data
        session = db.query(database_models.Session).filter(database_models.Session.id == session_id).first()
        problem = db.query(database_models.PracticeProblem).filter(database_models.PracticeProblem.id == session.problem_id).first()
        
        # 2. Analyze for patterns
        system_prompt = f"""
        You are an Expert Code Analyst. Analyze this student submission for the problem: {problem.title}.
        
        Code: {code}
        
        Return a JSON object:
        - correctness: boolean
        - mistake_patterns: list of identifying names (e.g. ['off-by-one', 'bad-base-case'])
        - reflection: A supportive 1-sentence summary for the student.
        - new_memories: List of objects [{{category: string, content: string, topic: string, importance: float}}]
        
        Ensure 'new_memories' contains actionable insights to store in the student's Hindsight profile.
        """
        
        response_json = llm_client.chat_completion([
            {"role": "system", "content": system_prompt}
        ], json_mode=True)
        
        analysis = json.loads(response_json)
        
        # 3. Write to DB
        session.reflection_summary = analysis.get('reflection', '')
        session.status = "completed" if analysis.get('correctness') else "struggled"
        db.commit()
        
        # 4. Save to Hindsight
        for m in analysis.get('new_memories', []):
            HindsightMemory.add_memory(db, user_id, pydantic_schemas.MemoryEntryBase(
                category=m.get('category', 'mistake_pattern'),
                content=m.get('content'),
                topic=m.get('topic', problem.topic),
                importance=m.get('importance', 0.5),
                session_id=session_id
            ))
            
        return analysis

mentor_engine = MentorEngine()
