from app.db.supabase import supabase


response = (
    supabase
    .table("programs")
    .select(
        """
        id,
        program_name,
        program_group,
        universities (
            university_name,
            type,
            city
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
    .limit(1)
    .execute()
)

print(response.data)