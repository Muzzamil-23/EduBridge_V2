from datetime import date

from app.db.supabase import supabase_admin


class AdvisorUsageRepository:

    def get_usage(
        self,
        user_id: str,
        usage_date: date,
    ) -> int:

        response = (
            supabase_admin
            .table("advisor_usage")
            .select("message_count")
            .eq("user_id", user_id)
            .eq("usage_date", usage_date.isoformat())
            .execute()
        )

        if not response.data:
            return 0

        return response.data[0]["message_count"]

    def increment_usage(
        self,
        user_id: str,
        usage_date: date,
    ) -> int:

        response = (
            supabase_admin
            .rpc(
                "increment_advisor_usage",
                {
                    "p_user_id": user_id,
                    "p_usage_date": usage_date.isoformat(),
                },
            )
            .execute()
        )

        print("ADVISOR USAGE INCREMENT RESPONSE:", response)

        if response is None:
            raise RuntimeError(
                "Supabase returned no response while incrementing advisor usage."
            )

        return response.data