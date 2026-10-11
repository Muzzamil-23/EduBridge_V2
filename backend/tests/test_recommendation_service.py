from app.schemas.recommendation import RecommendationReasoning
from app.services.recommendations.service import RecommendationService


class FakeStudentRepository:

    def get_profile(self, user_id):
        return {
            "academic_percentage": 84,
            "preferred_university_type": "Private",
            "preferred_program_group": "Computer Science & IT",
            "per_semester_budget": 250000,
            "scholarship_requirement": False,
            "hostel_requirement": False,
            "transport_requirement": True,
            "specific_universities": None,
            "entry_test_requirement": True,
        }


class FakeCatalogRepository:

    def get_programs(self):
        programs = []

        # 5 Strong Fit
        for i in range(5):
            programs.append({
                "id": i + 1,
                "program_name": f"Strong Program {i + 1}",
                "fit_label": "Strong Fit",
                "ranking_score": 95 - i,
            })

        # 5 Good Fit
        for i in range(5):
            programs.append({
                "id": i + 6,
                "program_name": f"Good Program {i + 1}",
                "fit_label": "Good Fit",
                "ranking_score": 80 - i,
            })

        # 5 Moderate Fit
        for i in range(5):
            programs.append({
                "id": i + 11,
                "program_name": f"Moderate Program {i + 1}",
                "fit_label": "Moderate Fit",
                "ranking_score": 60 - i,
            })

        # Low Fit should NOT be selected
        for i in range(5):
            programs.append({
                "id": i + 16,
                "program_name": f"Low Program {i + 1}",
                "fit_label": "Low Fit",
                "ranking_score": 40 - i,
            })

        return programs


class FakeRecommendationFilter:

    def filter_programs(self, programs, profile):
        return programs


class FakeRecommendationRanker:

    def rank_programs(self, programs, profile):
        return sorted(
            programs,
            key=lambda program: program["ranking_score"],
            reverse=True,
        )


class FakeRecommendationReasoner:

    def generate_reasoning(self, program, profile):

        concerns = []

        if program["fit_label"] == "Good Fit":
            concerns = [
                "The student's academic percentage is relatively close "
                "to the program's minimum requirement."
            ]

        elif program["fit_label"] == "Moderate Fit":
            concerns = [
                "The student's academic percentage is below the "
                "program's preferred level."
            ]

        return RecommendationReasoning(
            fit_label="Strong Fit",
            reasoning=f"{program['program_name']} matches the student profile.",
            reasons=[
                "The program matches the student's preferences."
            ],
            concerns=concerns,
            decision_factors=[
                "Academic eligibility",
                "Program preference",
            ],
            next_actions=[
                "Review the admission requirements."
            ],
            evidence_fields={
                "program_name": program["program_name"]
            },
        )


class FakeRecommendationRepository:

    def __init__(self):
        self.deleted_user_id = None
        self.saved_user_id = None
        self.saved_recommendations = []

    def delete_user_recommendations(self, user_id):
        self.deleted_user_id = user_id

    def save_recommendations(
        self,
        user_id,
        recommendations,
    ):
        self.saved_user_id = user_id
        self.saved_recommendations = recommendations

        return recommendations


def create_service():

    return RecommendationService(
        catalog_repository=FakeCatalogRepository(),
        student_repository=FakeStudentRepository(),
        recommendation_repository=FakeRecommendationRepository(),
        recommendation_filter=FakeRecommendationFilter(),
        recommendation_ranker=FakeRecommendationRanker(),
        recommendation_reasoner=FakeRecommendationReasoner(),
    )


def test_selects_five_programs_from_each_fit_category():

    service = create_service()

    recommendations = service.generate_recommendations(
        user_id="test-user"
    )

    assert len(recommendations) == 15

    strong = [
        recommendation
        for recommendation in recommendations
        if recommendation["fit_label"] == "Strong Fit"
    ]

    good = [
        recommendation
        for recommendation in recommendations
        if recommendation["fit_label"] == "Good Fit"
    ]

    moderate = [
        recommendation
        for recommendation in recommendations
        if recommendation["fit_label"] == "Moderate Fit"
    ]

    low = [
        recommendation
        for recommendation in recommendations
        if recommendation["fit_label"] == "Low Fit"
    ]

    assert len(strong) == 5
    assert len(good) == 5
    assert len(moderate) == 5
    assert len(low) == 0


def test_low_fit_programs_are_not_selected():

    service = create_service()

    recommendations = service.generate_recommendations(
        user_id="test-user"
    )

    program_names = [
        recommendation["program_name"]
        for recommendation in recommendations
    ]

    assert "Low Program 1" not in program_names
    assert "Low Program 2" not in program_names
    assert "Low Program 3" not in program_names
    assert "Low Program 4" not in program_names
    assert "Low Program 5" not in program_names


def test_concerns_are_preserved():

    service = create_service()

    recommendations = service.generate_recommendations(
        user_id="test-user"
    )

    good_recommendations = [
        recommendation
        for recommendation in recommendations
        if recommendation["program_name"].startswith("Good")
    ]

    moderate_recommendations = [
        recommendation
        for recommendation in recommendations
        if recommendation["program_name"].startswith("Moderate")
    ]

    assert len(good_recommendations) == 5
    assert len(moderate_recommendations) == 5

    for recommendation in good_recommendations:
        assert len(recommendation["concerns"]) > 0

    for recommendation in moderate_recommendations:
        assert len(recommendation["concerns"]) > 0


def test_fit_label_from_system_cannot_be_overwritten_by_llm():

    service = create_service()

    recommendations = service.generate_recommendations(
        user_id="test-user"
    )

    strong = [
        recommendation
        for recommendation in recommendations
        if recommendation["program_name"].startswith("Strong")
    ]

    good = [
        recommendation
        for recommendation in recommendations
        if recommendation["program_name"].startswith("Good")
    ]

    moderate = [
        recommendation
        for recommendation in recommendations
        if recommendation["program_name"].startswith("Moderate")
    ]

    assert all(
        recommendation["fit_label"] == "Strong Fit"
        for recommendation in strong
    )

    assert all(
        recommendation["fit_label"] == "Good Fit"
        for recommendation in good
    )

    assert all(
        recommendation["fit_label"] == "Moderate Fit"
        for recommendation in moderate
    )


def test_existing_recommendations_are_deleted_and_new_ones_saved():

    repository = FakeRecommendationRepository()

    service = RecommendationService(
        catalog_repository=FakeCatalogRepository(),
        student_repository=FakeStudentRepository(),
        recommendation_repository=repository,
        recommendation_filter=FakeRecommendationFilter(),
        recommendation_ranker=FakeRecommendationRanker(),
        recommendation_reasoner=FakeRecommendationReasoner(),
    )

    recommendations = service.generate_recommendations(
        user_id="test-user"
    )

    assert repository.deleted_user_id == "test-user"
    assert repository.saved_user_id == "test-user"
    assert repository.saved_recommendations == recommendations
