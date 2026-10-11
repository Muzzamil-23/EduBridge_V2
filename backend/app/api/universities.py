from fastapi import APIRouter, HTTPException

from app.repositories.catalog import CatalogRepository

router = APIRouter(
    prefix="/universities",
    tags=["Universities"],
)

catalog_repository = CatalogRepository()


@router.get("")
def get_universities():
    try:
        universities = catalog_repository.get_universities()

        return {
            "success": True,
            "universities": universities,
        }

    except Exception as exc:
        print("UNIVERSITIES ERROR:", repr(exc))
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch universities.",
        )


@router.get("/{uni_id}")
def get_university_with_programs(uni_id: int):
    try:
        university = catalog_repository.get_university_with_programs(
            uni_id
        )

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        return {
            "success": True,
            "university": university,
        }

    except HTTPException:
        raise

    except Exception as exc:
        print("UNIVERSITY DETAILS ERROR:", repr(exc))
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch university details.",
        )