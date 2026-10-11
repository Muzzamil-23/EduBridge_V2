from app.repositories.catalog import CatalogRepository
from app.repositories.student import StudentRepository
from app.services.recommendations.filtering import RecommendationFilter
from app.services.recommendations.ranking import RecommendationRanker


USER_ID = "cadd3e82-e301-4114-99ee-b3bacd884c43"


def main():
    student_repository = StudentRepository()
    catalog_repository = CatalogRepository()
    recommendation_filter = RecommendationFilter()
    recommendation_ranker = RecommendationRanker()

    # 1. Get student profile
    profile = student_repository.get_profile(USER_ID)

    if not profile:
        print("Student profile not found.")
        return

    # 2. Get all programs
    programs = catalog_repository.get_programs()

    print(f"Total programs: {len(programs)}")

    # 3. Apply existing eligibility filters
    filtered_programs = recommendation_filter.filter_programs(
        programs=programs,
        profile=profile,
    )

    print(f"Filtered programs: {len(filtered_programs)}")

    # 4. Rank all eligible programs
    ranked_programs = recommendation_ranker.rank_programs(
        programs=filtered_programs,
        profile=profile,
    )

    print(f"Ranked programs: {len(ranked_programs)}")

    # 5. Print all scores
    print("\n" + "=" * 80)
    print("ALL RANKING SCORES")
    print("=" * 80)

    for index, program in enumerate(ranked_programs, start=1):

        university = program.get("university") or {}
        features = program.get("features") or {}

        print(
            f"{index:>3}. "
            f"Score: {program['ranking_score']:>6.2f} | "
            f"Academic: {program['_academic_score']:.3f} | "
            f"Budget: {program['_budget_score']:.3f} | "
            f"Facility: {program['_facility_score']:.3f} | "
            f"{program.get('program_name')} | "
            f"{university.get('university_name')} | "
            f"Min Academic: {features.get('min_academic_percent')} | "
            f"Fee: {features.get('semester_fee')}"
        )

    # 6. Print summary statistics
    scores = [
        program["ranking_score"]
        for program in ranked_programs
    ]

    if scores:
        print("\n" + "=" * 80)
        print("SCORE SUMMARY")
        print("=" * 80)

        print(f"Highest score: {max(scores):.2f}")
        print(f"Lowest score:  {min(scores):.2f}")
        print(f"Average score: {sum(scores) / len(scores):.2f}")

        # Useful percentile-style positions
        sorted_scores = sorted(scores, reverse=True)

        print("\nScore positions:")
        for position in [5, 10, 15, 20, 25, 30, 40, 50, 60, 70]:
            if position <= len(sorted_scores):
                print(
                    f"Top {position:>2}: "
                    f"{sorted_scores[position - 1]:.2f}"
                )


if __name__ == "__main__":
    main()