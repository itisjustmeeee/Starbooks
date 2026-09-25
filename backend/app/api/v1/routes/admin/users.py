from typing import Annotated
from fastapi import APIRouter, Depends, Query

from backend.app.api.deps import require_admin
from backend.app.core.exceptions import NotFoundError
from backend.app.schemas.common import Page
from backend.app.schemas.user import UserOut
from backend.app.repositories import user_repo

router = APIRouter(prefix="/admin/users", tags=["admin:users"], dependencies=[Depends(require_admin)])


@router.get("", response_model=Page[UserOut])
async def list_users(
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    users, total = await user_repo.list_users(page, limit)
    return {"items": users, "total": total, "page": page, "limit": limit}


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int):
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise NotFoundError("User not found")
    return user


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int):
    if not await user_repo.get_by_id(user_id):
        raise NotFoundError("User not found")
    await user_repo.delete_user(user_id)