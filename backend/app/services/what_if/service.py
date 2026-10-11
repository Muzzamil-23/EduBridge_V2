from copy import deepcopy

from app.repositories.catalog import CatalogRepository
from app.repositories.student import StudentRepository

from app.services.recommendations.filtering import RecommendationFilter
from app.services.recommendations.ranking import RecommendationRanker
from app.services.recommendations.reasoning import RecommendationReasoner
from app.services.ai.llm.groq import GroqLLMProvider


class WhatIfService:

    def __init__(
        self,
        catalog_repository=None,
        student_repository=None,
        recommendation_filter=None,
        recommendation_ranker=None,
        recommendation_reasoner=None,
        top_n: int = 5,
    ):
        self.catalog_repository = catalog_repository or CatalogRepository()
        self.student_repository = student_repository or StudentRepository()
        self.recommendation_filter = recommendation_filter or RecommendationFilter()
        self.recommendation_ranker = recommendation_ranker or RecommendationRanker()
        self.recommendation_reasoner = (
            recommendation_reasoner
            or RecommendationReasoner(
                llm_provider=GroqLLMProvider()
            )
        )
        self.top_n = top_n

    def generate_what_if(
        self,
        user_id: str,
        changes: dict,
    ) -> list[dict]:

        # Get the student's actual profile
        profile = self.student_repository.get_profile(user_id)

        if not profile:
            raise ValueError("Student profile not found.")

        # Create a temporary copy so the actual profile is never modified
        simulated_profile = deepcopy(profile)

        # Apply only the requested What-If changes
        for field, value in changes.items():
            if value is not None:
                simulated_profile[field] = value

        # Get all available programs
        programs = self.catalog_repository.get_programs()

        if not programs:
            return []

        # Apply the same recommendation filters to the simulated profile
        filtered_programs = self.recommendation_filter.filter_programs(
            programs=programs,
            profile=simulated_profile,
        )

        if not filtered_programs:
            return []

        # Rank programs using the simulated profile
        ranked_programs = self.recommendation_ranker.rank_programs(
            programs=filtered_programs,
            profile=simulated_profile,
        )

        # Select up to 5 recommendations from each fit category
        strong_fits = [
            program
            for program in ranked_programs
            if program.get("fit_label") == "Strong Fit"
        ][:self.top_n]

        good_fits = [
            program
            for program in ranked_programs
            if program.get("fit_label") == "Good Fit"
        ][:self.top_n]

        moderate_fits = [
            program
            for program in ranked_programs
            if program.get("fit_label") == "Moderate Fit"
        ][:self.top_n]

        selected_programs = (
            strong_fits
            + good_fits
            + moderate_fits
        )

        if not selected_programs:
            return []

        # Generate LLM reasoning for the temporary recommendations
        reasoning_results = (
            self.recommendation_reasoner.generate_batch_reasoning(
                programs=selected_programs,
                profile=simulated_profile,
            )
        )

        if len(reasoning_results) != len(selected_programs):
            raise ValueError(
                "LLM returned an incorrect number of reasoning results."
            )

        # Combine program data with LLM reasoning
        recommendations = []

        for program, reasoning in zip(
            selected_programs,
            reasoning_results,
        ):
            recommendations.append({
                **program,
                **reasoning.model_dump(),
                "fit_label": program["fit_label"],
                "ai_model": (
                    self.recommendation_reasoner
                    .llm_provider
                    .model_name
                ),
            })

        # What-If recommendations are temporary.
        # Do NOT save them to the database.
        return recommendations