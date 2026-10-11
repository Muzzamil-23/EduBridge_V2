from app.schemas.query import QueryPlan, RetrievalMode
from app.schemas.retrieval import RetrievalResult
from app.services.retrieval.hybrid import HybridRetriever


class FakeQueryPlanner:
    def plan(self, query: str) -> QueryPlan:
        return QueryPlan(
            mode=RetrievalMode.HYBRID,
            search_query="Computer Science programs in Karachi",
            city="Karachi",
            university_type="Private",
            program_name="Computer Science",
            program_group="Computer Science & IT",
            max_fee=150000,
            academic_percentage=80,
            test_score=70,
            entry_test_required=True,
            needs_hostel=True,
            needs_transport=True,
        )


class FakeSemanticRetriever:
    def __init__(self):
        self.received_query = None
        self.received_match_count = None

    def search(
        self,
        query: str,
        entity_type: str | None = None,
        match_count: int = 5,
    ):
        self.received_query = query
        self.received_match_count = match_count

        return [
            RetrievalResult(
                entity_type="program",
                entity_id=1,
                content="Computer Science at Test University",
                similarity=0.91,
            )
        ]


class FakeStructuredRetriever:
    def __init__(self):
        self.received_filters = None

    def search_programs(
        self,
        city=None,
        university_type=None,
        program_name=None,
        program_group=None,
        max_fee=None,
        academic_percentage=None,
        test_score=None,
        entry_test_required=None,
        needs_hostel=None,
        needs_transport=None,
        limit=20,
    ):
        self.received_filters = {
            "city": city,
            "university_type": university_type,
            "program_name": program_name,
            "program_group": program_group,
            "max_fee": max_fee,
            "academic_percentage": academic_percentage,
            "test_score": test_score,
            "entry_test_required": entry_test_required,
            "needs_hostel": needs_hostel,
            "needs_transport": needs_transport,
            "limit": limit,
        }

        return [
            {
                "id": 1,
                "program_name": "Computer Science",
                "universities": {
                    "uni_id": 100,
                    "university_name": "Test University",
                    "type": "Private",
                    "city": "Karachi",
                    "has_hostel": True,
                    "has_transport": True,
                },
                "university_program_features": [
                    {
                        "semester_fee": 120000,
                        "min_academic_percent": 0.75,
                        "min_test_score": 0.60,
                        "entry_test_required": True,
                    }
                ],
            }
        ]


def test_hybrid_search_passes_all_structured_filters():
    retriever = HybridRetriever()

    fake_semantic = FakeSemanticRetriever()
    fake_structured = FakeStructuredRetriever()

    retriever.query_planner = FakeQueryPlanner()
    retriever.semantic = fake_semantic
    retriever.structured = fake_structured

    semantic_results, structured_results = retriever.search(
        "Find private Computer Science universities in Karachi under 150k"
    )

    assert semantic_results
    assert structured_results

    assert semantic_results[0].similarity == 0.91

    assert fake_semantic.received_query == (
        "Computer Science programs in Karachi"
    )

    assert fake_semantic.received_match_count == 5

    assert fake_structured.received_filters == {
        "city": "Karachi",
        "university_type": "Private",
        "program_name": "Computer Science",
        "program_group": "Computer Science & IT",
        "max_fee": 150000,
        "academic_percentage": 80,
        "test_score": 70,
        "entry_test_required": True,
        "needs_hostel": True,
        "needs_transport": True,
        "limit": 20,
    }