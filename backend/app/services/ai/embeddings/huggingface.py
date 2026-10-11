from huggingface_hub import InferenceClient

from app.core.config import settings
from app.services.ai.embeddings.base import EmbeddingProvider


class HuggingFaceEmbeddingProvider(EmbeddingProvider):

    def __init__(self):
        self.client = InferenceClient(
            api_key=settings.huggingface_api_key
        )
        self.model = settings.embedding_model

    @property
    def model_name(self) -> str:
        return self.model

    def embed_document(self, text: str) -> list[float]:
        embedding = self.client.feature_extraction(
            text=text,
            model=self.model,
        )
        return embedding[0].tolist()

    def embed_query(self, text: str) -> list[float]:
        embedding = self.client.feature_extraction(
            text=text,
            model=self.model,
        )
        return embedding[0].tolist()