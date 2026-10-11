from app.repositories.catalog import CatalogRepository
from app.repositories.embeddings import EmbeddingRepository

from app.services.ai.embeddings.base import EmbeddingProvider
from app.services.ai.embeddings.local import LocalQwenEmbeddingProvider

from app.services.knowledge.document_builders.program import (
    build_program_document,
    normalize_program_record,
)
from app.services.knowledge.document_builders.scholarship import (
    build_scholarship_document,
)
from app.services.knowledge.document_builders.university import (
    build_university_document,
)


class EmbeddingIndexingService:

    def __init__(
        self,
        provider: EmbeddingProvider | None = None,
    ):
        self.catalog_repository = CatalogRepository()
        self.embedding_repository = EmbeddingRepository()
        self.provider = provider or LocalQwenEmbeddingProvider()

    def generate_university_embeddings(self) -> list[dict]:
        universities = self.catalog_repository.get_universities()
        results = []

        for university in universities:
            document = build_university_document(university)
            embedding = self.provider.embed_document(document)

            saved = self.embedding_repository.save_embedding(
                entity_type="university",
                entity_id=university["uni_id"],
                content=document,
                embedding=embedding,
                model_name=self.provider.model_name,
            )

            results.append(saved)

        return results

    def generate_program_embeddings(self) -> list[dict]:
        programs = self.catalog_repository.get_programs()
        results = []

        for program in programs:
            normalized_program = normalize_program_record(program)
            document = build_program_document(normalized_program)
            embedding = self.provider.embed_document(document)

            saved = self.embedding_repository.save_embedding(
                entity_type="program",
                entity_id=program["id"],
                content=document,
                embedding=embedding,
                model_name=self.provider.model_name,
            )

            results.append(saved)

        return results

    def generate_scholarship_embeddings(self) -> list[dict]:
        scholarships = self.catalog_repository.get_scholarships()
        results = []

        for scholarship in scholarships:
            document = build_scholarship_document(scholarship)
            embedding = self.provider.embed_document(document)

            saved = self.embedding_repository.save_embedding(
                entity_type="scholarship",
                entity_id=scholarship["id"],
                content=document,
                embedding=embedding,
                model_name=self.provider.model_name,
            )

            results.append(saved)

        return results