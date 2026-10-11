from app.services.recommendations.ranking import RecommendationRanker


def make_program(
    name,
    university,
    academic_difference,
    semester_fee,
    hostel=False,
    transport=False,
):
    return {
        "program_name": name,
        "university": {
            "university_name": university,
            "has_hostel": hostel,
            "has_transport": transport,
        },
        "features": {
            "semester_fee": semester_fee,
        },
        "academic_difference": academic_difference,
    }


def test_programs_are_ranked_highest_first():
    ranker = RecommendationRanker()

    programs = [
        make_program(
            "Program A",
            "University A",
            academic_difference=2,
            semester_fee=140000,
        ),
        make_program(
            "Program B",
            "University B",
            academic_difference=15,
            semester_fee=80000,
        ),
    ]

    profile = {
        "academic_percentage": 85,
        "per_semester_budget": 150000,
    }

    results = ranker.rank_programs(programs, profile)

    assert len(results) == 2
    assert results[0]["program_name"] == "Program B"
    assert (
        results[0]["ranking_score"]
        > results[1]["ranking_score"]
    )


def test_specific_university_gets_preference_boost():
    ranker = RecommendationRanker()

    programs = [
        make_program(
            "Program A",
            "FAST",
            academic_difference=5,
            semester_fee=100000,
        ),
        make_program(
            "Program B",
            "IBA",
            academic_difference=5,
            semester_fee=100000,
        ),
    ]

    profile = {
        "academic_percentage": 85,
        "per_semester_budget": 150000,
        "specific_universities": "FAST",
    }

    results = ranker.rank_programs(programs, profile)

    assert results[0]["university"]["university_name"] == "FAST"
    assert results[0]["ranking_score"] > results[1]["ranking_score"]


def test_non_requested_universities_are_not_removed():
    ranker = RecommendationRanker()

    programs = [
        make_program(
            "Program A",
            "FAST",
            academic_difference=5,
            semester_fee=100000,
        ),
        make_program(
            "Program B",
            "IBA",
            academic_difference=10,
            semester_fee=90000,
        ),
    ]

    profile = {
        "academic_percentage": 85,
        "per_semester_budget": 150000,
        "specific_universities": "FAST",
    }

    results = ranker.rank_programs(programs, profile)

    universities = {
        result["university"]["university_name"]
        for result in results
    }

    assert universities == {"FAST", "IBA"}


def test_lower_fee_gets_better_budget_score():
    ranker = RecommendationRanker()

    programs = [
        make_program(
            "Expensive Program",
            "University A",
            academic_difference=10,
            semester_fee=145000,
        ),
        make_program(
            "Affordable Program",
            "University B",
            academic_difference=10,
            semester_fee=80000,
        ),
    ]

    profile = {
        "academic_percentage": 85,
        "per_semester_budget": 150000,
    }

    results = ranker.rank_programs(programs, profile)

    assert results[0]["program_name"] == "Affordable Program"


def test_facility_requirements_affect_ranking():
    ranker = RecommendationRanker()

    programs = [
        make_program(
            "Program A",
            "University A",
            academic_difference=10,
            semester_fee=100000,
            hostel=True,
            transport=True,
        ),
        make_program(
            "Program B",
            "University B",
            academic_difference=10,
            semester_fee=100000,
            hostel=False,
            transport=False,
        ),
    ]

    profile = {
        "academic_percentage": 85,
        "per_semester_budget": 150000,
        "hostel_requirement": True,
        "transport_requirement": True,
    }

    results = ranker.rank_programs(programs, profile)

    assert results[0]["program_name"] == "Program A"
    assert results[0]["ranking_score"] > results[1]["ranking_score"]


def test_ranking_score_is_between_zero_and_hundred():
    ranker = RecommendationRanker()

    programs = [
        make_program(
            "Program A",
            "University A",
            academic_difference=15,
            semester_fee=50000,
        ),
    ]

    profile = {
        "academic_percentage": 90,
        "per_semester_budget": 200000,
    }

    results = ranker.rank_programs(programs, profile)

    assert 0 <= results[0]["ranking_score"] <= 100