from app.db.supabase import supabase_admin


class EmbeddingRepository:

    def get_universities(self) -> list[dict]:
        try:
            response = (
                supabase_admin
                .table("universities")
                .select(
                    "uni_id, university_name, about, type, city, "
                    "has_hostel, has_transport, extracurriculars, established"
                )
                .execute()
            )

            return response.data

        except Exception as e:
            raise RuntimeError(
                f"Failed to retrieve universities from database: {e}"
            ) from e
            
    
    def get_programs(self) -> list[dict]:
        try:
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
                .execute()
            )

            return response.data

        except Exception as e:
            raise RuntimeError(
                f"Failed to retrieve programs from database: {e}"
            ) from e
            
            
    def get_scholarships(self) -> list[dict]:
        try:
            response = (
                supabase_admin
                .table("scholarships")
                .select(
                    "id, name, type, active, description"
                )
                .execute()
            )

            return response.data

        except Exception as e:
            raise RuntimeError(
            f"Failed to retrieve scholarships from database: {e}"
        ) from e
            
    
    def save_embedding(
        self,
        entity_type: str,
        entity_id: int,
        content: str,
        embedding: list[float],
        model_name: str,
    ) -> dict:
        try:
            response = (
                supabase_admin
                .table("embeddings")
                .upsert(
                    {
                        "entity_type": entity_type,
                        "entity_id": entity_id,
                        "content": content,
                        "embedding": embedding,
                        "model_name": model_name,
                    },
                    on_conflict="entity_type,entity_id",
                )
                .execute()
            )

            return response.data[0]

        except Exception as e:
            raise RuntimeError(
                f"Failed to save embedding for "
                f"{entity_type}:{entity_id}: {e}"
        ) from e        