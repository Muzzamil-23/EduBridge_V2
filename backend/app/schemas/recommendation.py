from pydantic import BaseModel, Field


class RecommendationReasoning(BaseModel):
    fit_label: str = Field(
        description="Overall fit of the program for the student."
    )

    reasoning: str = Field(
        description="Short explanation of why the program fits the student."
    )

    reasons: list[str] = Field(
        default_factory=list,
        description="Specific reasons supporting the recommendation."
    )

    concerns: list[str] = Field(
        default_factory=list,
        description="Potential concerns or limitations."
    )

    decision_factors: list[str] = Field(
        default_factory=list,
        description="Important factors the student should consider."
    )

    next_actions: list[str] = Field(
        default_factory=list,
        description="Useful next steps for the student."
    )

    evidence_fields: dict = Field(
        default_factory=dict,
        description="Important factual values supporting the recommendation."
    )