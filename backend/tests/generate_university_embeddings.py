from backend.app.services.knowledge.indexing.service import (
    EmbeddingGenerationService,
)


service = EmbeddingGenerationService()

results = service.generate_university_embeddings()

print(f"\nSuccessfully saved {len(results)} university embeddings.")