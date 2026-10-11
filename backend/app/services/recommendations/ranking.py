ACADEMIC_TOLERANCE = 5.0

FIT_STRONG = 0.90
FIT_GOOD = 0.70
FIT_MODERATE = 0.50


class RecommendationRanker:

    def rank_programs(
        self,
        programs: list[dict],
        profile: dict,
    ) -> list[dict]:

        ranked_programs = []

        for program in programs:

            academic_score = self._academic_score(
                program,
                profile,
            )

            budget_score = self._budget_score(
                program,
                profile,
            )

            facility_score = self._facility_score(
                program,
                profile,
            )

            # Academic fit is the primary factor.
            # Budget and facilities are secondary factors.
            ranking_score = (
                academic_score * 0.70
                + budget_score * 0.20
                + facility_score * 0.10
            ) * 100

            fit_label = self._fit_label(academic_score)

            result = {
                **program,
                "ranking_score": round(ranking_score, 2),
                "fit_label": fit_label,
                "_academic_score": academic_score,
                "_budget_score": budget_score,
                "_facility_score": facility_score,
            }

            ranked_programs.append(result)

        # Final ranking is based on the weighted ranking score.
        ranked_programs.sort(
            key=lambda item: item["ranking_score"],
            reverse=True,
        )

        return ranked_programs

    def _fit_label(
        self,
        academic_score: float,
    ) -> str:

        if academic_score >= FIT_STRONG:
            return "Strong Fit"

        if academic_score >= FIT_GOOD:
            return "Good Fit"

        if academic_score >= FIT_MODERATE:
            return "Moderate Fit"

        return "Low Fit"

    def _academic_score(
        self,
        program: dict,
        profile: dict,
    ) -> float:

        student_percentage = profile.get("academic_percentage")

        if student_percentage is None:
            return 0.5

        academic_difference = program.get("academic_difference")

        if academic_difference is None:
            return 0.5

        difference = float(academic_difference)

        if difference < 0:
            gap = abs(difference)

            if gap > ACADEMIC_TOLERANCE:
                return 0.0

            return 1.0 - (
                gap / ACADEMIC_TOLERANCE
            ) * 0.5

        if difference == 0:
            return 1.0

        score = 1.0 - (difference / 40.0)

        return max(
            0.0,
            min(1.0, score),
        )

    def _budget_score(
        self,
        program: dict,
        profile: dict,
    ) -> float:

        budget = profile.get("per_semester_budget")

        if budget is None:
            return 0.5

        features = program.get("features") or {}
        semester_fee = features.get("semester_fee")

        if semester_fee is None:
            return 0.0

        budget = float(budget)
        semester_fee = float(semester_fee)

        if budget <= 0:
            return 0.0

        if semester_fee > budget:
            return 0.0

        budget_ratio = semester_fee / budget

        return 0.90 - (budget_ratio * 0.15)

    def _facility_score(
        self,
        program: dict,
        profile: dict,
    ) -> float:

        university = program.get("university") or {}

        requested_facilities = 0
        matched_facilities = 0

        if profile.get("hostel_requirement"):
            requested_facilities += 1

            if university.get("has_hostel") is True:
                matched_facilities += 1

        if profile.get("transport_requirement"):
            requested_facilities += 1

            if university.get("has_transport") is True:
                matched_facilities += 1

        if requested_facilities == 0:
            return 0.5

        return matched_facilities / requested_facilities