from pydantic import BaseModel, Field


class WhatIfChanges(BaseModel):
    preferred_university_type: str | None = None

    preferred_program_group: str | None = None

    per_semester_budget: float | None = Field(
        default=None,
        ge=0,
    )

    hostel_requirement: bool | None = None

    transport_requirement: bool | None = None

    entry_test_requirement: bool | None = None

    academic_percentage: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    specific_universities: str | None = None


class WhatIfRequest(BaseModel):
    changes: WhatIfChanges