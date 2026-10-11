from app.db.supabase import supabase_admin


class StructuredRetriever:
    @staticmethod
    def _normalize_percentage(value):
        if value is None:
            return None

        if value > 1:
            return value / 100

        return value

    def search_programs(
        self,
        city=None,
        university_name=None,
        university_type=None,
        program_name=None,
        program_group=None,
        max_fee=None,
        academic_percentage=None,
        test_score=None,
        entry_test_required=None,
        needs_hostel=None,
        needs_transport=None,
        limit=20,
    ):
        query = supabase_admin.table("programs").select(
            """
            id,
            program_name,
            program_group,
            universities (
                uni_id,
                university_name,
                type,
                city,
                has_hostel,
                has_transport
            ),
            university_program_features (
                admission_fee,
                semester_fee,
                credit_hours,
                min_academic_percent,
                min_test_score,
                entry_test_required,
                fee_per_credit_hr
            )
            """
        )

        if program_name:
            query = query.ilike(
                "program_name",
                f"%{program_name}%"
            )

        if program_group:
            query = query.ilike(
                "program_group",
                f"%{program_group}%"
            )

        response = query.execute()
        results = response.data or []

        if university_name:
            name = university_name.strip().lower()

            aliases = {
                "fast": ["fast", "fast-nuces", "fast national university"],
                "ned": ["ned", "ned university"],
                "university of karachi": [
                    "university of karachi",
                    "uok",
                ],
                "iba": [
                    "iba",
                    "institute of business administration",
                ],
            }

            accepted_names = aliases.get(name, [name])

            results = [
                result
                for result in results
                if result.get("universities")
                and any(
                    alias in result["universities"].get(
                        "university_name", ""
                    ).lower()
                    for alias in accepted_names
                )
            ]

        if city:
            results = [
                result
                for result in results
                if result.get("universities")
                and (
                    result["universities"].get("city") or ""
                ).lower() == city.strip().lower()
            ]

        if university_type:
            results = [
                result
                for result in results
                if result.get("universities")
                and (
                    result["universities"].get("type") or ""
                ).lower() == university_type.strip().lower()
            ]

        if needs_hostel is not None:
            results = [
                result
                for result in results
                if result.get("universities")
                and result["universities"].get("has_hostel")
                == needs_hostel
            ]

        if needs_transport is not None:
            results = [
                result
                for result in results
                if result.get("universities")
                and result["universities"].get("has_transport")
                == needs_transport
            ]

        academic_percentage = self._normalize_percentage(
            academic_percentage
        )
        test_score = self._normalize_percentage(test_score)

        filtered_results = []

        for result in results:
            features = result.get("university_program_features") or []
            feature = features[0] if features else {}

            semester_fee = feature.get("semester_fee")
            min_academic_percent = feature.get("min_academic_percent")
            min_test_score = feature.get("min_test_score")
            entry_test = feature.get("entry_test_required")

            if max_fee is not None and (
                semester_fee is None or semester_fee > max_fee
            ):
                continue

            if academic_percentage is not None and (
                min_academic_percent is None
                or academic_percentage < min_academic_percent
            ):
                continue

            if test_score is not None and (
                min_test_score is None
                or test_score < min_test_score
            ):
                continue

            if (
                entry_test_required is not None
                and entry_test != entry_test_required
            ):
                continue

            filtered_results.append(result)

        return filtered_results[:limit]
