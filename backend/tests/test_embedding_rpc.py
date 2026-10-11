from app.repositories.embeddings import EmbeddingRepository
from app.services.ai.embeddings.local import LocalQwenEmbeddingProvider


def test_embedding_rpc():
    provider = LocalQwenEmbeddingProvider()
    repository = EmbeddingRepository()

    query = "Which Computer Science programs in Karachi are under 150k?"
    embedding = provider.embed_query(query)

    results = repository.match_embeddings(
        query_embedding=embedding,
        match_count=5,
    )

    print("\nRPC RESULTS:", results)

    assert results