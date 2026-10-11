from app.db.supabase import supabase_admin


class CatalogRepository:

    def get_universities(self) -> list[dict]:
        response = (
            supabase_admin
            .table("universities")
            .select("*")
            .execute()
        )

        return response.data
    
    
    def get_university_with_programs(self, uni_id: int) -> dict | None:
        response = (
            supabase_admin
            .table("universities")
            .select(
                """
                *,
                programs (
                    *,
                    university_program_features (*)
                )
                """
            )
            .eq("uni_id", uni_id)
            .single()
            .execute()
        )

        return response.data

    def get_programs(self) -> list[dict]:
        response = (
            supabase_admin
            .table("programs")
            .select(
                """
                id,
                program_name,
                program_group,
                universities (
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
            .execute()
        )

        return response.data

    def get_scholarships(self) -> list[dict]:
        response = (
            supabase_admin
            .table("scholarships")
            .select(
                "id, name, type, active, description"
            )
            .execute()
        )

        return response.data