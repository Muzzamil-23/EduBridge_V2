from app.db.supabase import supabase_admin


class StudentRepository:

    def get_profile(self, user_id: str) -> dict | None:
        personal_response = (
            supabase_admin
            .table("student_personal_data")
            .select(
                "first_name, last_name, email, age"
            )
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )

        academic_response = (
            supabase_admin
            .table("student_academic_data")
            .select(
                """
                preferred_university_type,
                preferred_program_group,
                per_semester_budget,
                scholarship_requirement,
                hostel_requirement,
                transport_requirement,
                specific_universities,
                entry_test_requirement,
                academic_percentage
                """
            )
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )

        personal_data = personal_response.data
        academic_data = academic_response.data

        if not personal_data and not academic_data:
            return None

        return {
            **(personal_data or {}),
            **(academic_data or {}),
        }