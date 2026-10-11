ACADEMIC_TOLERANCE = 5.0


class RecommendationFilter:

    def filter_programs(
        self,
        programs: list[dict],
        profile: dict,
    ) -> list[dict]:
        filtered_programs = []

        for program in programs:
            university = program.get("universities") or {}
            features = program.get("university_program_features") or {}

            # Supabase may return a list for a one-to-many relationship.
            if isinstance(features, list):
                features = features[0] if features else {}

            # University type
            if not self._matches_university_type(
                university,
                profile.get("preferred_university_type"),
            ):
                continue

            # Program group
            if not self._matches_program_group(
                program,
                profile.get("preferred_program_group"),
            ):
                continue

            # Budget
            if not self._matches_budget(
                features,
                profile.get("per_semester_budget"),
            ):
                continue

            # Hostel
            if not self._matches_hostel(
                university,
                profile.get("hostel_requirement"),
            ):
                continue

            # Transport
            if not self._matches_transport(
                university,
                profile.get("transport_requirement"),
            ):
                continue

            # Academic percentage
            if not self._matches_academic_percentage(
                features,
                profile.get("academic_percentage"),
            ):
                continue

            # Entry test
            if not self._matches_entry_test(
                features,
                profile.get("entry_test_requirement"),
            ):
                continue

            filtered_programs.append(
                self._add_filter_metadata(
                    program,
                    university,
                    features,
                    profile,
                )
            )

        return filtered_programs

    def _matches_university_type(
        self,
        university: dict,
        preferred_type: str | None,
    ) -> bool:
        if not preferred_type:
            return True

        actual_type = university.get("type")

        return (
            actual_type
            and actual_type.strip().lower()
            == preferred_type.strip().lower()
        )

    
    
    def _matches_program_group(
        self,
        program: dict,
        preferred_group: str | None,
    ) -> bool:
        if not preferred_group:
            return True

        actual_group = program.get("program_group")

        return (
            actual_group
            and actual_group.strip().lower()
            == preferred_group.strip().lower()
        )

    def _matches_budget(
        self,
        features: dict,
        budget: float | int | None,
    ) -> bool:
        if budget is None:
            return True

        semester_fee = features.get("semester_fee")

        if semester_fee is None:
            return False

        return float(semester_fee) <= float(budget)

    def _matches_hostel(
        self,
        university: dict,
        hostel_required: bool | None,
    ) -> bool:
        if not hostel_required:
            return True

        return university.get("has_hostel") is True

    def _matches_transport(
        self,
        university: dict,
        transport_required: bool | None,
    ) -> bool:
        if not transport_required:
            return True

        return university.get("has_transport") is True

    def _matches_academic_percentage(
        self,
        features: dict,
        academic_percentage: float | int | None,
    ) -> bool:
        if academic_percentage is None:
            return True

        minimum_required = features.get("min_academic_percent")

        if minimum_required is None:
            return True

        # Database stores minimum academic percentage as a decimal.
        # Example: 0.82 = 82%.
        minimum_required_percent = float(minimum_required) * 100

        return float(academic_percentage) >= (
            minimum_required_percent - ACADEMIC_TOLERANCE
        )

    def _matches_entry_test(
        self,
        features: dict,
        entry_test_requirement: bool | None,
    ) -> bool:
        if entry_test_requirement is None:
            return True

        entry_test_required = features.get("entry_test_required")

        if entry_test_required is None:
            return True

        return entry_test_required == entry_test_requirement

    def _add_filter_metadata(
        self,
        program: dict,
        university: dict,
        features: dict,
        profile: dict,
    ) -> dict:
        result = {
            **program,
            "university": university,
            "features": features,
        }

        academic_percentage = profile.get("academic_percentage")
        minimum_required = features.get("min_academic_percent")

        if academic_percentage is not None and minimum_required is not None:
            minimum_required_percent = float(minimum_required) * 100

            result["academic_difference"] = (
                float(academic_percentage)
                - minimum_required_percent
            )

        return result