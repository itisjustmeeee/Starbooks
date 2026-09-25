from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
import jwt

from backend.app.core.exceptions import UnauthorizedError
from backend.app.core.security import decode_token
from backend.app.schemas.auth import TokenOut
from backend.app.schemas.user import UserOut, UserRegisterIn
from backend.app.services import auth_service

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
async def register(data: UserRegisterIn):
    user = await auth_service.register(data.username, data.email, data.password)
    return user


@router.post("/token", response_model=TokenOut)
async def login(form: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = await auth_service.authenticate(form.username, form.password)
    return auth_service.issue_tokens(user)


@router.post("/token/refresh", response_model=TokenOut)
async def refresh(refresh_token: str):
    try:
        payload = decode_token(refresh_token)
    except jwt.PyJWTError:
        raise UnauthorizedError("Invalid refresh token")
    if payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid token type")

    from backend.app.repositories import user_repo
    user = await user_repo.get_by_id(int(payload["sub"]))
    if not user:
        raise UnauthorizedError("User not found")
    return auth_service.issue_tokens(user)