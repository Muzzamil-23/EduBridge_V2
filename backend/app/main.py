from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db.supabase import supabase
from app.api.advisor_api import router as advisor_router
from app.api.recommendations_api import router as recommendations_router
from app.api.what_if import router as what_if_router
from app.api.universities import router as universities_router


app = FastAPI(
    title="Edubridge V2 API",
    version="2.0.0",
    description="AI-powered university discovery and student guidance API",
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://edu-bridge-v2.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
app.include_router(advisor_router)
app.include_router(recommendations_router)
app.include_router(what_if_router)
app.include_router(universities_router)


@app.get("/")
def root():
    return {"message": "Edubridge V2 API is running"}


@app.get("/health")
def health_check():
    try:
        tables = [
            ("universities", "uni_id"),
            ("programs", "id"),
            ("university_program_features", "feature_id"),
            ("scholarships", "id"),
        ]

        for table_name, column_name in tables:
            (
                supabase
                .table(table_name)
                .select(column_name)
                .limit(1)
                .execute()
            )

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "database": "unavailable",
            },
        )
