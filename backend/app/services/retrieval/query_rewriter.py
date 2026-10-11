import json

from app.schemas.query import QueryPlan
from app.services.ai.llm.groq import GroqLLMProvider
from app.services.ai.prompting.query import (
    QUERY_REWRITE_SYSTEM_PROMPT,
    build_query_rewrite_prompt,
)


class QueryRewriter:
    def __init__(self):
        self.llm_provider = GroqLLMProvider()

    def rewrite(self, query: str) -> QueryPlan:
        if not query.strip():
            raise ValueError("Query cannot be empty.")

        response = self.llm_provider.generate(
            system_prompt=QUERY_REWRITE_SYSTEM_PROMPT,
            user_prompt=build_query_rewrite_prompt(query),
        )

        try:
            data = json.loads(response)
        except json.JSONDecodeError as exc:
            raise ValueError("LLM returned invalid JSON.") from exc

        try:
            return QueryPlan.model_validate(data)
        except Exception as exc:
            raise ValueError("LLM returned an invalid query plan.") from exc
