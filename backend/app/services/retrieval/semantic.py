from app.repositories.embeddings import EmbeddingRepository
from app.schemas.retrieval import RetrievalResult
from app.services.ai.embeddings.base import EmbeddingProvider
from app.services.ai.embeddings.local import LocalQwenEmbeddingProvider


class SemanticRetriever:

    def __init__(
        self,
        embedding_provider: EmbeddingProvider | None = None,
    ):
        self.repository = EmbeddingRepository()
        self.embedding_provider = (
            embedding_provider or LocalQwenEmbeddingProvider()
        )

    def search(
        self,
        query: str,
        entity_type: str | None = None,
        match_count: int = 5,
    ) -> list[RetrievalResult]:

        if not query.strip():
            raise ValueError("Search query cannot be empty.")

        query_embedding = self.embedding_provider.embed_query(query)

        return self.repository.match_embeddings(
            query_embedding=query_embedding,
            entity_type=entity_type,
            match_count=match_count,
        )