from enum import Enum

from pydantic import BaseModel, Field


class RetrievalMode(str, Enum):
    STRUCTURED = "structured"
    SEMANTIC = "semantic"
    HYBRID = "hybrid"


class QueryPlan(BaseModel):
    mode: RetrievalMode
    search_query: str

    # University filters
    city: str | None = None
    university_type: str | None = None
    university_name: str | None = None
    
    
    # Program filters
    program_name: str | None = None
    program_group: str | None = None

    # Admission and budget constraints
    max_fee: int | None = Field(
        default=None,
        ge=0,
    )

    academic_percentage: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    test_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    entry_test_required: bool | None = None

    # University facilities
    needs_hostel: bool | None = None
    needs_transport: bool | None = None
