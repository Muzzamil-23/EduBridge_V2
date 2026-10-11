from app.db.supabase import supabase_admin
from app.schemas.retrieval import RetrievalResult


class EmbeddingRepository:

    def match_embeddings(
        self,
        query_embedding: list[float],
        entity_type: str | None = None,
        match_count: int = 5,
    ) -> list[RetrievalResult]:

        response = supabase_admin.rpc(
            "match_embeddings",
            {
                "query_embedding": query_embedding,
                "match_entity_type": entity_type,
                "match_count": match_count,
            },
        ).execute()

        return [
            RetrievalResult(**result)
            for result in response.data
        ]

    def save_embedding(
        self,
        entity_type: str,
        entity_id: int,
        content: str,
        embedding: list[float],
        model_name: str,
    ) -> dict:

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