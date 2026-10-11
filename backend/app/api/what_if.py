from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_current_user

from app.schemas.what_if import WhatIfRequest

from app.services.what_if.service import WhatIfService


router = APIRouter(
    prefix="/what-if",
    tags=["What-If"],
)


what_if_service = WhatIfService()


@router.post("")
def generate_what_if(
    request: WhatIfRequest,
    current_user=Depends(get_current_user),
):
    try:

        changes = request.changes.model_dump(
            exclude_none=True
        )

        if not changes:
            raise HTTPException(
                status_code=400,
                detail="At least one What-If change is required.",
            )

        recommendations = (
            what_if_service.generate_what_if(
                user_id=current_user.id,
                changes=changes,
            )
        )

        return {
            "success": True,
            "recommendations": recommendations,
        }

    except HTTPException:
        raise

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        print(
            "WHAT-IF ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate What-If recommendations.",
        )