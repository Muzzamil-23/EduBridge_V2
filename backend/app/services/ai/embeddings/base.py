from abc import ABC, abstractmethod


class EmbeddingProvider(ABC):

    @property
    @abstractmethod
    def model_name(self) -> str:
        pass

    @abstractmethod
    def embed_document(self, text: str) -> list[float]:
        pass

    @abstractmethod
    def embed_query(self, text: str) -> list[float]:
        pass