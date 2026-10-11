from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.db.supabase import supabase, supabase_admin
from app.db.dependencies import get_access_token
from app.api.advisor_api import router as advisor_router
from app.api.recommendations_api import router as recommendations_router
from app.api.what_if import router as what_if_router
from app.api.universities import router as universities_router


app = FastAPI(
    title="Edubridge V2 API",
    version="2.0.0",
    description="AI-powered university discovery and student guidance API"
)


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Registering routers

app.include_router(advisor_router)
app.include_router(recommendations_router)
app.include_router(what_if_router)
app.include_router(universities_router)


@app.get("/")
def root():
    return {
        "message": "Edubridge V2 API is running"
    }
    


@app.get("/health")
def health_check():
    try:
        universities = (
            supabase
            .table("universities")
            .select("uni_id")
            .limit(1)
            .execute()
        )

        programs = (
            supabase
            .table("programs")
            .select("id")
            .limit(1)
            .execute()
        )

        features = (
            supabase
            .table("university_program_features")
            .select("feature_id")
            .limit(1)
            .execute()
        )

        scholarships = (
            supabase
            .table("scholarships")
            .select("id")
            .limit(1)
            .execute()
        )

        return {
            "status": "healthy",
            "database": "connected",
            "universities": universities.data,
            "programs": programs.data,
            "features": features.data,
            "scholarships": scholarships.data
        }

    except Exception as e:
        print("DATABASE ERROR:", repr(e))

        return {
            "status": "error",
            "database": "failed",
            "error": str(e)
        }


@app.get("/test-auth")
def test_auth(token: str = Depends(get_access_token)):
    return {
        "message": "Token received successfully",
        "token_length": len(token)
    }
    

@app.get("/test-advisor-db")
def test_advisor_db():
    response = (
        supabase_admin
        .table("advisor_usage")
        .select("message_count")
        .limit(1)
        .execute()
    )

    return {
        "response": str(response),
        "data": response.data if response else None,
    }