from app.schemas.retrieval import RetrievalResult
from app.services.retrieval.formatter import (
    format_retrieval_context,
)


def test_formats_percentages_correctly():
    structured_results = [
        {
            "program_name": "Computer Science",
            "program_group": "Computer Science & IT",
            "universities": {
                "university_name": "Test University",
                "type": "Private",
                "city": "Karachi",
                "has_hostel": True,
                "has_transport": False,
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

    context = format_retrieval_context(
        structured_results=structured_results
    )

    assert "79.64%" in context
    assert "61.91%" in context


def test_formats_boolean_values_correctly():
    structured_results = [
        {
            "program_name": "Computer Science",
            "universities": {
                "university_name": "Test University",
                "type": "Private",
                "city": "Karachi",
                "has_hostel": True,
                "has_transport": False,
            },
            "university_program_features": [],
        }
    ]

    context = format_retrieval_context(
        structured_results=structured_results
    )

    assert "Hostel available: Yes" in context
    assert "Transport available: No" in context


def test_formats_missing_values():
    structured_results = [
        {
            "program_name": "Computer Science",
            "universities": {
                "university_name": None,
                "type": None,
                "city": None,
                "has_hostel": None,
                "has_transport": None,
            },
            "university_program_features": [
                {
                    "min_academic_percent": None,
                    "min_test_score": None,
                    "entry_test_required": None,
                    "admission_fee": None,
                    "semester_fee": None,
                    "fee_per_credit_hr": None,
                    "credit_hours": None,
                }
            ],
        }
    ]

    context = format_retrieval_context(
        structured_results=structured_results
    )

    assert "Not specified" in context
    assert "Minimum academic percentage: Not specified" in context
    assert "Minimum test score: Not specified" in context
    assert "Entry test required: Not specified" in context


def test_formats_semantic_results():
    semantic_results = [
        RetrievalResult(
            entity_type="program",
            entity_id=1,
            content="Computer Science is offered by Test University.",
            similarity=0.92,
        )
    ]

    context = format_retrieval_context(
        semantic_results=semantic_results
    )

    assert "Source:" in context
    assert (
        "Computer Science is offered by Test University."
        in context
    )


def test_returns_message_when_no_results():
    context = format_retrieval_context()

    assert context == "No relevant information was found."


def test_does_not_truncate_context_under_limit():
    structured_results = [
        {
            "program_name": "Computer Science",
            "universities": {
                "university_name": "Test University",
                "type": "Private",
                "city": "Karachi",
                "has_hostel": True,
                "has_transport": True,
            },
            "university_program_features": [
                {
                    "min_academic_percent": 0.8,
                    "min_test_score": 0.6,
                    "entry_test_required": True,
                    "admission_fee": 10000,
                    "semester_fee": 100000,
                    "fee_per_credit_hr": 5000,
                    "credit_hours": 130,
                }
            ],
        }
    ]

    context = format_retrieval_context(
        structured_results=structured_results
    )

    assert "Additional retrieved information was omitted" not in context


def test_truncates_context_at_max_chars():
    semantic_results = [
        RetrievalResult(
            entity_type="program",
            entity_id=index,
            content="A" * 3000,
            similarity=0.9,
        )
        for index in range(10)
    ]

    context = format_retrieval_context(
        semantic_results=semantic_results,
        max_chars=5000,
    )

    assert len(context) > 5000
    assert (
        "Additional retrieved information was omitted"
        in context
    )