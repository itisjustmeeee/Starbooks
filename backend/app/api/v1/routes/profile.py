from fastapi import APIRouter, Depends

from backend.app.api.deps import get_current_user
from backend.app.core.exceptions import ConflictError, UnauthorizedError
from backend.app.core.security import verify_password
from backend.app.schemas.user import (
    UserNicknameUpdateIn,
    UserOut,
    UserPasswordUpdateIn,
)
from backend.app.repositories import user_repo

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=UserOut)
async def me(user=Depends(get_current_user)):
    return user


@router.patch("/nickname", response_model=UserOut)
async def update_nickname(data: UserNicknameUpdateIn, user=Depends(get_current_user)):
    existing = await user_repo.get_by_username(data.username)
    if existing and existing.user_id != user.user_id:
        raise ConflictError("Username already taken")
    return await user_repo.update_username(user.user_id, data.username)


@router.patch("/password", status_code=204)
async def update_password(data: UserPasswordUpdateIn, user=Depends(get_current_user)):
    if not verify_password(data.old_password, user.password_hash):
        raise UnauthorizedError("Old password is incorrect")
    await user_repo.update_password(user.user_id, data.new_password)


@router.delete("", status_code=204)
async def delete_me(user=Depends(get_current_user)):
    await user_repo.delete_user(user.user_id)