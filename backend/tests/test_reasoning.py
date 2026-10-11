import json

import pytest

from app.schemas.recommendation import RecommendationReasoning
from app.services.recommendations.reasoning import RecommendationReasoner


class FakeLLMProvider:
    model_name = "fake-model"

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        return json.dumps({
            "fit_label": "Strong Fit",
            "reasoning": "This program matches the student's academic profile and preferences.",
            "reasons": [
                "Matches the preferred program group",
                "Fits within the student's budget",
            ],
            "concerns": [
                "Admission requirements may change in the current admission cycle"
            ],
            "decision_factors": [
                "Academic eligibility",
                "Semester fee",
            ],
            "next_actions": [
                "Check the latest admission requirements",
                "Review the application deadline",
            ],
            "evidence_fields": {
                "academic_percentage": 82,
                "semester_fee": 85000,
            },
        })


class InvalidLLMProvider:
    model_name = "fake-model"

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        return "This is not valid JSON"


@pytest.fixture
def program():
    return {
        "id": 1001,
        "program_name": "BS Computer Science",
        "program_group": "Computer Science / IT",
        "ranking_score": 91.5,
        "academic_difference": 8.0,
        "university": {
            "university_name": "Example University",
            "city": "Karachi",
            "type": "Private",
            "has_hostel": True,
            "has_transport": True,
        },
        "features": {
            "semester_fee": 85000,
            "min_academic_percent": 0.74,
            "entry_test_required": True,
        },
    }


@pytest.fixture
def profile():
    return {
        "preferred_university_type": "Private",
        "preferred_program_group": "Computer Science / IT",
        "per_semester_budget": 100000,
        "academic_percentage": 82,
        "hostel_requirement": True,
        "transport_requirement": True,
        "entry_test_requirement": True,
    }


def test_generate_reasoning_returns_valid_schema(program, profile):
    reasoner = RecommendationReasoner(
        llm_provider=FakeLLMProvider()
    )

    result = reasoner.generate_reasoning(
        program=program,
        profile=profile,
    )

    assert isinstance(result, RecommendationReasoning)

    assert result.fit_label == "Strong Fit"
    assert len(result.reasons) == 2
    assert len(result.concerns) == 1
    assert len(result.decision_factors) == 2
    assert len(result.next_actions) == 2

    assert result.evidence_fields["academic_percentage"] == 82
    assert result.evidence_fields["semester_fee"] == 85000


def test_invalid_json_raises_error(program, profile):
    reasoner = RecommendationReasoner(
        llm_provider=InvalidLLMProvider()
    )

    with pytest.raises(
        ValueError,
        match="LLM returned invalid JSON",
    ):
        reasoner.generate_reasoning(
            program=program,
            profile=profile,
        )