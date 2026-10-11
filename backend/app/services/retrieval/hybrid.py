from app.schemas.query import RetrievalMode
from app.schemas.retrieval import RetrievalResult
from app.services.retrieval.query_planner_service import QueryPlanner
from app.services.retrieval.semantic import SemanticRetriever
from app.services.retrieval.structured import StructuredRetriever


class HybridRetriever:
    def __init__(self):
        self.semantic = SemanticRetriever()
        self.structured = StructuredRetriever()
        self.query_planner = QueryPlanner()

    def search(
        self,
        query: str,
        match_count: int = 5,
    ) -> tuple[list[RetrievalResult], list[dict]]:
        plan = self.query_planner.plan(query)

        semantic_results = []
        structured_results = []

        if plan.mode in (
            RetrievalMode.SEMANTIC,
            RetrievalMode.HYBRID,
        ):
            semantic_results = self.semantic.search(
                query=plan.search_query,
                match_count=match_count,
            )

        if plan.mode in (
            RetrievalMode.STRUCTURED,
            RetrievalMode.HYBRID,
        ):
            structured_results = self.structured.search_programs(
                city=plan.city,
                university_name=plan.university_name,
                university_type=plan.university_type,
                program_name=plan.program_name,
                program_group=plan.program_group,
                max_fee=plan.max_fee,
                academic_percentage=plan.academic_percentage,
                test_score=plan.test_score,
                entry_test_required=plan.entry_test_required,
                needs_hostel=plan.needs_hostel,
                needs_transport=plan.needs_transport,
            )

        return semantic_results, structured_results

    def semantic_search(
        self,
        query: str,
        entity_type: str | None = None,
        match_count: int = 5,
    ) -> list[RetrievalResult]:
        return self.semantic.search(
            query=query,
            entity_type=entity_type,
            match_count=match_count,
        )

    def search_programs(self, **filters) -> list[dict]:
        return self.structured.search_programs(**filters)
