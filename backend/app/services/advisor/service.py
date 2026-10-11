
from app.services.advisor.usage import AdvisorUsageService
from app.services.ai.llm.groq import GroqLLMProvider
from app.services.ai.prompting.advisor import (
    ADVISOR_SYSTEM_PROMPT,
    build_advisor_prompt,
)
from app.services.retrieval.hybrid import HybridRetriever
from app.services.retrieval.formatter import format_retrieval_context


class AdvisorService:
    def __init__(
        self,
        retriever=None,
        usage_service=None,
        llm_provider=None,
    ):
        self.retriever = retriever or HybridRetriever()
        self.usage_service = (
            usage_service or AdvisorUsageService()
        )
        self.llm_provider = (
            llm_provider or GroqLLMProvider()
        )

    def generate_answer(self, query: str) -> str:
        if not query.strip():
            raise ValueError("Advisor query cannot be empty.")

        semantic_results, structured_results = self.retriever.search(
            query=query,
            match_count=10,
        )

        context = format_retrieval_context(
            semantic_results=semantic_results,
            structured_results=structured_results,
        )

        user_prompt = build_advisor_prompt(
            query=query,
            context=context,
        )

        return self.llm_provider.generate(
            system_prompt=ADVISOR_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

    def ask(self, user_id: str, query: str) -> str:
        if not query.strip():
            raise ValueError("Advisor query cannot be empty.")

        self.usage_service.check_and_increment(user_id)

        return self.generate_answer(query=query)
