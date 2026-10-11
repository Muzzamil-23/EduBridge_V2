from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.db.dependencies import get_current_user
from app.services.advisor.service import AdvisorService


router = APIRouter(
    prefix="/advisor",
    tags=["Advisor"],
)

advisor_service = AdvisorService()


class AdvisorChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class AdvisorChatResponse(BaseModel):
    answer: str


@router.post("/chat", response_model=AdvisorChatResponse)
def advisor_chat(
    request: AdvisorChatRequest,
    current_user=Depends(get_current_user),
):
    try:
        answer = advisor_service.ask(
            user_id=current_user.id,
            query=request.message,
        )

        return AdvisorChatResponse(
            answer=answer
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        import traceback

        print("ADVISOR ERROR:", repr(e))
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Failed to generate advisor response.",
        )