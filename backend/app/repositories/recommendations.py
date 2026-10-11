from app.db.supabase import supabase_admin


class RecommendationRepository:

    def delete_user_recommendations(self, user_id: str) -> None:
        response = (
            supabase_admin.table("user_recommendations")
            .delete()
            .eq("user_id", user_id)
            .execute()
        )

        if response.data is None:
            raise ValueError("Failed to delete existing recommendations.")

    def save_recommendations(
        self,
        user_id: str,
        recommendations: list[dict],
    ) -> list[dict]:

        if not recommendations:
            return []

        records = []

        for recommendation in recommendations:
            records.append({
                "user_id": user_id,
                "program_id": recommendation.get("id"),
                "fit_label": recommendation.get("fit_label"),
                "reasoning": recommendation.get("reasoning"),
                "reasons": recommendation.get("reasons", []),
                "concerns": recommendation.get("concerns", []),
                "decision_factors": recommendation.get("decision_factors", []),
                "next_actions": recommendation.get("next_actions", []),
                "evidence_fields": recommendation.get("evidence_fields", {}),
                "ai_model": recommendation.get("ai_model"),
            })

        response = (
            supabase_admin
            .table("user_recommendations")
            .insert(records)
            .execute()
        )

        if response.data is None:
            raise ValueError("Failed to save recommendations.")

        return response.data

    def get_user_recommendations(self, user_id: str) -> list[dict]:

        response = (
            supabase_admin
            .table("user_recommendations")
            .select("""
                id,
                program_id,
                fit_label,
                reasoning,
                reasons,
                concerns,
                decision_factors,
                next_actions,
                evidence_fields,
                ai_model,
                generated_at,
                programs (
                    id,
                    program_name,
                    program_group,
                    universities (
                        uni_id,
                        university_name,
                        type,
                        city
                    )
                )
            """)
            .eq("user_id", user_id)
            .order("generated_at", desc=True)
            .execute()
        )

        if response.data is None:
            raise ValueError("Failed to fetch recommendations.")

        return response.data