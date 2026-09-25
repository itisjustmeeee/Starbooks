from fastapi import APIRouter, Depends

from backend.app.api.deps import require_admin
from backend.app.schemas.book import BookCreateIn, BookDetailOut, BookUpdateIn
from backend.app.services import book_service

router = APIRouter(
    prefix="/admin/books",
    tags=["admin:books"],
    dependencies=[Depends(require_admin)],
)


@router.post("", response_model=BookDetailOut, status_code=201)
async def create_book(data: BookCreateIn):
    return await book_service.create_book(data)


@router.patch("/{book_id}", response_model=BookDetailOut)
async def update_book(book_id: int, data: BookUpdateIn):
    return await book_service.update_book(book_id, data)


@router.delete("/{book_id}", status_code=204)
async def delete_book(book_id: int):
    await book_service.delete_book(book_id)