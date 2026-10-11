from app.repositories.catalog import CatalogRepository
from app.repositories.student import StudentRepository
from app.services.recommendations.filtering import RecommendationFilter
from app.services.recommendations.ranking import RecommendationRanker


USER_ID = ""


def main():
    student_repository = StudentRepository()
    catalog_repository = CatalogRepository()

    # Get student profile
    profile = student_repository.get_profile(USER_ID)

    if not profile:
        print("Student profile not found.")
        return

    print("=== STUDENT PROFILE ===")
    print(profile)

    # Get all programs
    programs = catalog_repository.get_programs()

    print("\nTotal programs:", len(programs))

    # Apply deterministic filters
    recommendation_filter = RecommendationFilter()

    filtered_programs = recommendation_filter.filter_programs(
        programs=programs,
        profile=profile,
    )

    print("Filtered programs:", len(filtered_programs))

    # Rank filtered programs
    ranker = RecommendationRanker()

    ranked_programs = ranker.rank_programs(
        programs=filtered_programs,
        profile=profile,
    )

    # Display top 5
    print("\n=== TOP 5 RANKED PROGRAMS ===")

    for index, program in enumerate(ranked_programs[:5], start=1):

        university = program.get("university") or {}
        features = program.get("features") or {}

        print(f"\n#{index}")
        print("Program ID:", program.get("id"))
        print("Program:", program.get("program_name"))
        print("University:", university.get("university_name"))
        print("University Type:", university.get("type"))
        print("Program Group:", program.get("program_group"))
        print("Semester Fee:", features.get("semester_fee"))
        print("Minimum Academic:", features.get("min_academic_percent"))
        print("Student Academic:", profile.get("academic_percentage"))
        print("Academic Difference:", program.get("academic_difference"))
        print("Transport:", university.get("has_transport"))
        print("Entry Test:", features.get("entry_test_required"))
        print("Ranking Score:", program.get("ranking_score"))


if __name__ == "__main__":
    main()