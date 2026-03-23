import openai
import json
import os
from typing import List, Dict, Any, Optional

class LLMClient:
    """
    Wrapper for LLM interactions.
    """
    def __init__(self, api_key: str = None, base_url: str = None):
        self.client = openai.OpenAI(
            api_key=api_key or os.getenv("OPENAI_API_KEY", "mock-key"),
            base_url=base_url or os.getenv("OPENAI_BASE_URL", None)
        )
        self.model = os.getenv("LLM_MODEL", "gpt-4o")

    def chat_completion(self, messages: List[Dict[str, str]], json_mode: bool = False) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                response_format={"type": "json_object"} if json_mode else None
            )
            return response.choices[0].message.content
        except Exception as e:
            # Fallback for hackathon demo if API fails
            if json_mode:
                return json.dumps({"error": str(e), "fallback": True})
            return f"I'm having trouble connecting to my brain right now: {str(e)}"

llm_client = LLMClient()
