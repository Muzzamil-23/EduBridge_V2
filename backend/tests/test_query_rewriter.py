from app.schemas.query import RetrievalMode
from app.services.retrieval.query_rewriter import QueryRewriter


class FakeLLM:
    model_name = "fake-model"

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        return """
        {
            "mode": "hybrid",
            "search_query": "Computer Science programs in Karachi under 150000 PKR semester fee",
            "city": "Karachi",
            "program_name": "Computer Science",
            "max_fee": 150000
        }
        """.strip()


def test_query_rewriter_returns_valid_query_plan():
    rewriter = QueryRewriter()
    rewriter.llm_provider = FakeLLM()

    plan = rewriter.rewrite(
        "Which Computer Science programs in Karachi are under 150k?"
    )

    assert plan.mode == RetrievalMode.HYBRID
    assert plan.city == "Karachi"
    assert plan.program_name == "Computer Science"
    assert plan.max_fee == 150000
    assert "Computer Science" in plan.search_query


def test_query_rewriter_rejects_empty_query():
    rewriter = QueryRewriter()
    rewriter.llm_provider = FakeLLM()

    try:
        rewriter.rewrite("")
        assert False
    except ValueError as exc:
        assert str(exc) == "Query cannot be empty."


def test_query_rewriter_rejects_invalid_json():
    class InvalidLLM:
        model_name = "fake-model"

        def generate(self, system_prompt: str, user_prompt: str) -> str:
            return "not valid json"

    rewriter = QueryRewriter()
    rewriter.llm_provider = InvalidLLM()

    try:
        rewriter.rewrite("Find CS programs")
        assert False
    except ValueError as exc:
        assert str(exc) == "LLM returned invalid JSON."
