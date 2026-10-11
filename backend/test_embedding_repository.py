from app.repositories.embedding_repository import EmbeddingRepository


repository = EmbeddingRepository()

scholarships = repository.get_scholarships()

print("Total scholarships:", len(scholarships))

print("\nFirst scholarship:")
print(scholarships[0])