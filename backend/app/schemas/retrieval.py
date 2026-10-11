from pydantic import BaseModel


class RetrievalResult(BaseModel):
    entity_type: str
    entity_id: int
    content: str
    similarity: float | None = None