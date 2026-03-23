from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models import database_models, pydantic_schemas

router = APIRouter()

@router.get("/", response_model=List[pydantic_schemas.PracticeProblem])
def list_problems(db: Session = Depends(get_db)):
    problems = db.query(database_models.PracticeProblem).all()
    
    # Seed data if empty
    if not problems:
        seed_problems = [
            database_models.PracticeProblem(
                title="Sum of an Array",
                topic="Arrays",
                difficulty="beginner",
                description="Write a function that takes an array of numbers and returns their sum. Handle the empty case.",
                base_code="def sum_array(arr):\n    # your code here\n    pass",
                test_cases=[{'input': '[]', 'expected': '0'}, {'input': '[1, 2, 3]', 'expected': '6'}]
            ),
            database_models.PracticeProblem(
                title="Fibonacci Sequence",
                topic="Recursion",
                difficulty="intermediate",
                description="Write a recursive function to find the Nth Fibonacci number.",
                base_code="def fib(n):\n    # base case?\n    pass",
                test_cases=[{'input': '0', 'expected': '0'}, {'input': '1', 'expected': '1'}, {'input': '5', 'expected': '5'}]
            ),
            database_models.PracticeProblem(
                title="Binary Search Edge Cases",
                topic="Binary Search",
                difficulty="intermediate",
                description="Implement a binary search function that handles empty arrays and non-existent targets correctly.",
                base_code="def binary_search(arr, val):\n    # handle edge cases carefully\n    pass",
                test_cases=[{'input': '([], 1)', 'expected': '-1'}, {'input': '([1, 2, 3], 2)', 'expected': '1'}]
            )
        ]
        for p in seed_problems:
            db.add(p)
        db.commit()
        problems = db.query(database_models.PracticeProblem).all()
        
    return problems

@router.get("/{problem_id}", response_model=pydantic_schemas.PracticeProblem)
def get_problem(problem_id: int, db: Session = Depends(get_db)):
    return db.query(database_models.PracticeProblem).filter(database_models.PracticeProblem.id == problem_id).first()
