from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_current_user
from app.services.recommendations.service import RecommendationService


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)

recommendation_service = RecommendationService()


@router.post("/generate")
def generate_recommendations(
    current_user=Depends(get_current_user),
):
    try:
        recommendations = (
            recommendation_service.generate_recommendations(
                user_id=current_user.id
            )
        )

        return {
            "success": True,
            "recommendations": recommendations,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        print("RECOMMENDATION ERROR:", repr(exc))

        raise HTTPException(
            status_code=500,
            detail="Failed to generate recommendations.",
        )