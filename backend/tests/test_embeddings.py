from app.services.ai.embeddings.local import LocalQwenEmbeddingProvider


def test_local_embedding_provider():
    provider = LocalQwenEmbeddingProvider()

    embedding = provider.embed_document("Computer Science at a university")

    assert isinstance(embedding, list)
    assert len(embedding) == 1024
    assert all(isinstance(value, float) for value in embedding)
    assert provider.model_name