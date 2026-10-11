from sentence_transformers import SentenceTransformer

from app.core.config import settings
from app.services.ai.embeddings.base import EmbeddingProvider


class LocalQwenEmbeddingProvider(EmbeddingProvider):

    def __init__(self):
        self.model = settings.embedding_model
        self.model_instance = SentenceTransformer(
            self.model,
            device="cpu",
        )

    @property
    def model_name(self) -> str:
        return self.model

    def embed_document(self, text: str) -> list[float]:
        embedding = self.model_instance.encode(text)
        return embedding.tolist()

    def embed_query(self, text: str) -> list[float]:
        embedding = self.model_instance.encode(
            text,
            prompt_name="query",
        )
        return embedding.tolist()