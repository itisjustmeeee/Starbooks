from backend.app.core.exceptions import NotFoundError
from backend.app.repositories import genre_repo
from backend.app.repositories import author_repo, book_repo


async def list_books(page: int, limit: int, q, author, genre):
    items, total = await book_repo.list_books(page, limit, q, author, genre)
    return {"items": items, "total": total, "page": page, "limit": limit}


async def get_book_or_404(book_id: int):
    book = await book_repo.get_book(book_id)
    if not book:
        raise NotFoundError("Book not found")
    return book


async def create_book(data) -> dict:
    if not await author_repo.get(data.author_id):
        raise NotFoundError("Author not found")
    if data.genre_ids:
        found = await genre_repo.get_many(data.genre_ids)
        if len(found) != len(set(data.genre_ids)):
            raise NotFoundError("One or more genres not found")
    return await book_repo.create_book(data.model_dump(), data.genre_ids)


async def update_book(book_id: int, data) -> dict:
    await get_book_or_404(book_id)
    payload = data.model_dump(exclude_unset=True)
    genre_ids = payload.pop("genre_ids", None)

    if "author_id" in payload and not await author_repo.get(payload["author_id"]):
        raise NotFoundError("Author not found")

    return await book_repo.update_book(book_id, payload, genre_ids)


async def delete_book(book_id: int) -> None:
    await get_book_or_404(book_id)
    await book_repo.delete_book(book_id)