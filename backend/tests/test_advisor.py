from app.schemas.retrieval import RetrievalResult
from app.services.advisor.service import AdvisorService


class FakeRetriever:
    def __init__(self):
        self.received_query = None
        self.received_match_count = None

    def search(self, query: str, match_count: int = 5):
        self.received_query = query
        self.received_match_count = match_count

        semantic_results = [
            RetrievalResult(
                entity_type="program",
                entity_id=1,
                content="Computer Science is offered at Test University.",
                similarity=0.92,
            )
        ]

        structured_results = [
            {
                "program_name": "Computer Science",
                "program_group": "Computer Science & IT",
                "universities": {
                    "university_name": "Test University",
                    "type": "Private",
                    "city": "Karachi",
                    "has_hostel": True,
                    "has_transport": True,
                },
                "university_program_features": [
                    {
                        "min_academic_percent": 0.7964,
                        "min_test_score": 0.6191,
                        "entry_test_required": True,
                        "admission_fee": 10000,
                        "semester_fee": 120000,
                        "fee_per_credit_hr": 5000,
                        "credit_hours": 130,
                    }
                ],
            }
        ]

        return semantic_results, structured_results


class FakeUsageService:
    def __init__(self):
        self.received_user_id = None

    def check_and_increment(self, user_id: str):
        self.received_user_id = user_id
        return 1


class FakeLLMProvider:
    def __init__(self):
        self.system_prompt = None
        self.user_prompt = None

    def generate(self, system_prompt: str, user_prompt: str):
        self.system_prompt = system_prompt
        self.user_prompt = user_prompt

        return "Test University offers Computer Science in Karachi."


def test_advisor_generate_answer():
    fake_retriever = FakeRetriever()
    fake_usage = FakeUsageService()
    fake_llm = FakeLLMProvider()

    service = AdvisorService(
        retriever=fake_retriever,
        usage_service=fake_usage,
        llm_provider=fake_llm,
    )

    answer = service.generate_answer(
        "Tell me about Computer Science in Karachi."
    )

    assert answer == (
        "Test University offers Computer Science in Karachi."
    )

    assert fake_retriever.received_query == (
        "Tell me about Computer Science in Karachi."
    )

    assert fake_retriever.received_match_count == 10

    assert fake_llm.system_prompt is not None
    assert fake_llm.user_prompt is not None

    assert "79.64%" in fake_llm.user_prompt
    assert "61.91%" in fake_llm.user_prompt
    assert "Hostel available: Yes" in fake_llm.user_prompt
    assert "Transport available: Yes" in fake_llm.user_prompt


def test_advisor_ask_checks_usage():
    fake_retriever = FakeRetriever()
    fake_usage = FakeUsageService()
    fake_llm = FakeLLMProvider()

    service = AdvisorService(
        retriever=fake_retriever,
        usage_service=fake_usage,
        llm_provider=fake_llm,
    )

    answer = service.ask(
        user_id="user-123",
        query="Tell me about Computer Science.",
    )

    assert answer == (
        "Test University offers Computer Science in Karachi."
    )

    assert fake_usage.received_user_id == "user-123"


def test_advisor_rejects_empty_query():
    fake_retriever = FakeRetriever()
    fake_usage = FakeUsageService()
    fake_llm = FakeLLMProvider()

    service = AdvisorService(
        retriever=fake_retriever,
        usage_service=fake_usage,
        llm_provider=fake_llm,
    )

    try:
        service.generate_answer("")
        assert False, "Expected ValueError"
    except ValueError as exc:
        assert str(exc) == "Advisor query cannot be empty."


def test_advisor_ask_rejects_empty_query():
    fake_retriever = FakeRetriever()
    fake_usage = FakeUsageService()
    fake_llm = FakeLLMProvider()

    service = AdvisorService(
        retriever=fake_retriever,
        usage_service=fake_usage,
        llm_provider=fake_llm,
    )

    try:
        service.ask(
            user_id="user-123",
            query="   ",
        )
        assert False, "Expected ValueError"
    except ValueError as exc:
        assert str(exc) == "Advisor query cannot be empty."