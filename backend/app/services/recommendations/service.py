from app.repositories.catalog import CatalogRepository
from app.repositories.student import StudentRepository
from app.repositories.recommendations import RecommendationRepository

from app.services.recommendations.filtering import (
    RecommendationFilter,
)
from app.services.recommendations.ranking import (
    RecommendationRanker,
)
from app.services.recommendations.reasoning import (
    RecommendationReasoner,
)

from app.services.ai.llm.groq import GroqLLMProvider


class RecommendationService:

    def __init__(
        self,
        catalog_repository=None,
        student_repository=None,
        recommendation_repository=None,
        recommendation_filter=None,
        recommendation_ranker=None,
        recommendation_reasoner=None,
        top_n: int = 5,
    ):

        self.catalog_repository = (
            catalog_repository
            or CatalogRepository()
        )

        self.student_repository = (
            student_repository
            or StudentRepository()
        )

        self.recommendation_repository = (
            recommendation_repository
            or RecommendationRepository()
        )

        self.recommendation_filter = (
            recommendation_filter
            or RecommendationFilter()
        )

        self.recommendation_ranker = (
            recommendation_ranker
            or RecommendationRanker()
        )

        self.recommendation_reasoner = (
            recommendation_reasoner
            or RecommendationReasoner(
                llm_provider=GroqLLMProvider()
            )
        )

        self.top_n = top_n

    def generate_recommendations(
        self,
        user_id: str,
    ) -> list[dict]:

        # ==================================================
        # 0. Check for existing recommendations
        # ==================================================

        existing_recommendations = (
            self.recommendation_repository
            .get_user_recommendations(user_id)
        )

        if existing_recommendations:
            return existing_recommendations

        # ==================================================
        # 1. Get student profile
        # ==================================================

        profile = (
            self.student_repository.get_profile(
                user_id
            )
        )

        if not profile:
            raise ValueError(
                "Student profile not found."
            )

        # ==================================================
        # 2. Get all programs
        # ==================================================

        programs = (
            self.catalog_repository.get_programs()
        )

        if not programs:
            return []

        # ==================================================
        # 3. Apply hard filters
        # ==================================================

        filtered_programs = (
            self.recommendation_filter.filter_programs(
                programs=programs,
                profile=profile,
            )
        )

        if not filtered_programs:
            return []

        # ==================================================
        # 4. Rank eligible programs
        # ==================================================

        ranked_programs = (
            self.recommendation_ranker.rank_programs(
                programs=filtered_programs,
                profile=profile,
            )
        )

        # ==================================================
        # 5. Separate by deterministic fit label
        # ==================================================

        strong_fits = [
            program
            for program in ranked_programs
            if program.get("fit_label")
            == "Strong Fit"
        ]

        good_fits = [
            program
            for program in ranked_programs
            if program.get("fit_label")
            == "Good Fit"
        ]

        moderate_fits = [
            program
            for program in ranked_programs
            if program.get("fit_label")
            == "Moderate Fit"
        ]

        # ==================================================
        # 6. Select top programs from each category
        # ==================================================

        strong_fits = strong_fits[:self.top_n]
        good_fits = good_fits[:self.top_n]
        moderate_fits = moderate_fits[:self.top_n]

        selected_programs = (
            strong_fits
            + good_fits
            + moderate_fits
        )

        if not selected_programs:
            return []

        # ==================================================
        # 7. Generate LLM reasoning in small batches
        # ==================================================

        reasoning_results = []

        batch_size = 5

        for start in range(
            0,
            len(selected_programs),
            batch_size,
        ):

            batch = selected_programs[
                start:start + batch_size
            ]

            batch_results = (
                self.recommendation_reasoner
                .generate_batch_reasoning(
                    programs=batch,
                    profile=profile,
                )
            )

            if len(batch_results) != len(batch):
                raise ValueError(
                    "LLM returned an incorrect number "
                    "of reasoning results."
                )

            reasoning_results.extend(
                batch_results
            )

        # ==================================================
        # 8. Final validation
        # ==================================================

        if len(reasoning_results) != len(
            selected_programs
        ):
            raise ValueError(
                "LLM returned an incorrect total "
                "number of reasoning results."
            )

        # ==================================================
        # 9. Combine program data + AI reasoning
        # ==================================================

        recommendations = []

        for program, reasoning in zip(
            selected_programs,
            reasoning_results,
        ):

            recommendations.append({
                **program,
                **reasoning.model_dump(),

                # IMPORTANT:
                # Never allow the LLM to overwrite
                # the deterministic fit label.
                "fit_label": program["fit_label"],

                "ai_model": (
                    self.recommendation_reasoner
                    .llm_provider
                    .model_name
                ),
            })

        # ==================================================
        # 10. Replace previous recommendations
        # ==================================================

        self.recommendation_repository\
            .delete_user_recommendations(
                user_id=user_id
            )

        saved_recommendations = (
            self.recommendation_repository
            .save_recommendations(
                user_id=user_id,
                recommendations=recommendations,
            )
        )

        return saved_recommendations
