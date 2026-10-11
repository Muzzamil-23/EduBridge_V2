from backend.app.services.knowledge.indexing.service import EmbeddingGenerationService


service = EmbeddingGenerationService()

results = service.generate_program_embeddings()

print(f"\nSuccessfully saved {len(results)} program embeddings.")