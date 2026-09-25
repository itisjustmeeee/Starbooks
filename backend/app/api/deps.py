from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
import jwt

from backend.app.core.config import settings
from backend.app.core.exceptions import ForbiddenError, UnauthorizedError
from backend.app.core.security import decode_token
from backend.app.db.prisma import prisma

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_v1_prefix}/token")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_token(token)
    except jwt.PyJWTError:
        raise UnauthorizedError("Invalid or expired token")

    if payload.get("type") != "access":
        raise UnauthorizedError("Invalid token type")

    user_id = int(payload["sub"])
    user = await prisma.user.find_unique(where={"user_id": user_id})
    if user is None:
        raise UnauthorizedError("User not found")
    return user


async def require_admin(user=Depends(get_current_user)):
    if user.role != "Admin":
        raise ForbiddenError("Admin access required")
    return user