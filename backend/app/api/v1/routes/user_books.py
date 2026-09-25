from fastapi import APIRouter, Depends

from backend.app.api.deps import get_current_user
from backend.app.core.exceptions import ConflictError, NotFoundError
from backend.app.schemas.user_book import UserBookCreateIn, UserBookOut, UserBookStatusUpdateIn
from backend.app.repositories import user_book_repo
from backend.app.repositories import book_repo

router = APIRouter(prefix="/user_books", tags=["user_books"])


@router.get("", response_model=list[UserBookOut])
async def list_my_books(user=Depends(get_current_user)):
    return await user_book_repo.list_for_user(user.user_id)


@router.post("", response_model=UserBookOut, status_code=201)
async def add_book(data: UserBookCreateIn, user=Depends(get_current_user)):
    if not await book_repo.get_book(data.book_id):
        raise NotFoundError("Book not found")
    existing = await user_book_repo.get(user.user_id, data.book_id)
    if existing:
        raise ConflictError("Book already in library")
    return await user_book_repo.create(user.user_id, data.book_id, data.status)


@router.patch("/{book_id}/status", response_model=UserBookOut)
async def update_status(
    book_id: int, data: UserBookStatusUpdateIn, user=Depends(get_current_user)
):
    existing = await user_book_repo.get(user.user_id, book_id)
    if not existing:
        raise NotFoundError("Book not in library")
    return await user_book_repo.update_status(user.user_id, book_id, data.status)


@router.delete("/{book_id}", status_code=204)
async def remove_book(book_id: int, user=Depends(get_current_user)):
    existing = await user_book_repo.get(user.user_id, book_id)
    if not existing:
        raise NotFoundError("Book not in library")
    await user_book_repo.delete(user.user_id, book_id)