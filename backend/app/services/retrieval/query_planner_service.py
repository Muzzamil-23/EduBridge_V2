import logging

from app.schemas.query import QueryPlan
from app.services.retrieval.query_planner import QueryPlanner
from app.services.retrieval.query_rewriter import QueryRewriter


logger = logging.getLogger(__name__)


class QueryPlannerService:
    def __init__(self):
        self.llm_rewriter = QueryRewriter()
        self.fallback_planner = QueryPlanner()

    def plan(self, query: str) -> QueryPlan:
        if not query.strip():
            raise ValueError("Query cannot be empty.")

        try:
            return self.llm_rewriter.rewrite(query)
        except ValueError as exc:
            logger.warning(
                "LLM query planning failed. Using deterministic fallback: %s",
                exc,
            )
            return self.fallback_planner.plan(query)