from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.supabase import supabase

security = HTTPBearer()


def get_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    return credentials.credentials


def get_current_user(
    token: str = Depends(get_access_token),
):
    try:
        response = supabase.auth.get_user(token)

        if not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired authentication token.",
            )

        return response.user

    except HTTPException:
        raise

    except Exception as e:
        print("AUTH ERROR:", repr(e))

        raise HTTPException(
            status_code=401,
            detail="Authentication failed.",
        )