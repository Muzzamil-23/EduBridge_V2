from app.services.knowledge.indexing.service import EmbeddingIndexingService


def test_indexing_service_initializes():
    service = EmbeddingIndexingService()

    assert service.catalog_repository is not None
    assert service.embedding_repository is not None
    assert service.provider is not None


def test_indexing_methods_exist():
    service = EmbeddingIndexingService()

    assert callable(service.generate_university_embeddings)
    assert callable(service.generate_program_embeddings)
    assert callable(service.generate_scholarship_embeddings)