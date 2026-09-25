from typing import Annotated
from fastapi import APIRouter, Query

from backend.app.schemas.book import BookDetailOut, BookShortOut
from backend.app.schemas.common import Page
from backend.app.services import book_service

router = APIRouter(prefix="/catalog_books", tags=["catalog"])


@router.get("", response_model=Page[BookShortOut])
async def list_books(
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    q: str | None = None,
    author: str | None = None,
    genre: str | None = None,
):
    return await book_service.list_books(page, limit, q, author, genre)


@router.get("/{book_id}", response_model=BookDetailOut)
async def get_book(book_id: int):
    return await book_service.get_book_or_404(book_id)