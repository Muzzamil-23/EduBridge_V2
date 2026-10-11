from app.schemas.query import QueryPlan, RetrievalMode


def test_query_plan_schema():
    plan = QueryPlan(
        mode=RetrievalMode.HYBRID,
        search_query="CS programs in Karachi under 150k",
        city="Karachi",
        program_name="Computer Science",
        max_fee=150000,
    )

    assert plan.mode == RetrievalMode.HYBRID
    assert plan.search_query == "CS programs in Karachi under 150k"
    assert plan.city == "Karachi"
    assert plan.program_name == "Computer Science"
    assert plan.max_fee == 150000