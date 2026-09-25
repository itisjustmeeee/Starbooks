from backend.app.db.prisma import prisma


BOOK_INCLUDE = {
    "author": True,
    "books_genres": {"include": {"genre": True}},
}


def _serialize(book) -> dict:
    """Приводим Prisma-объект к плоскому dict с ключом genres."""
    data = book.model_dump()
    genres = [bg["genre"] for bg in data.pop("books_genres", [])]
    data["genres"] = genres
    return data


async def list_books(
    page: int = 1,
    limit: int = 20,
    q: str | None = None,
    author: str | None = None,
    genre: str | None = None,
) -> tuple[list[dict], int]:
    where: dict = {}

    if q:
        where["OR"] = [
            {"name": {"contains": q, "mode": "insensitive"}},
            {"author": {"is": {"OR": [
                {"name": {"contains": q, "mode": "insensitive"}},
                {"surname": {"contains": q, "mode": "insensitive"}},
            ]}}},
        ]

    if author:
        where.setdefault("author", {}).setdefault("is", {})
        where["author"]["is"]["OR"] = [
            {"name": {"contains": author, "mode": "insensitive"}},
            {"surname": {"contains": author, "mode": "insensitive"}},
        ]

    if genre:
        where["books_genres"] = {
            "some": {"genre": {"is": {"name": {"equals": genre, "mode": "insensitive"}}}}
        }

    total = await prisma.book.count(where=where)
    books = await prisma.book.find_many(
        where=where,
        include=BOOK_INCLUDE,
        skip=(page - 1) * limit,
        take=limit,
        order={"book_id": "asc"},
    )
    return [_serialize(b) for b in books], total


async def get_book(book_id: int) -> dict | None:
    book = await prisma.book.find_unique(where={"book_id": book_id}, include=BOOK_INCLUDE)
    return _serialize(book) if book else None


async def create_book(data: dict, genre_ids: list[int]) -> dict:
    book = await prisma.book.create(
        data={
            "name": data["name"],
            "author_id": data["author_id"],
            "description": data["description"],
            "publishing_date": data["publishing_date"],
            "image_url": data.get("image_url"),
            "read_url": data.get("read_url"),
            "books_genres": {
                "create": [{"genre_id": gid} for gid in genre_ids],
            },
        },
        include=BOOK_INCLUDE,
    )
    return _serialize(book)


async def update_book(book_id: int, data: dict, genre_ids: list[int] | None) -> dict:
    update_data: dict = {k: v for k, v in data.items() if v is not None}

    if genre_ids is not None:
        # пересоздаём связи
        await prisma.booksgenres.delete_many(where={"book_id": book_id})
        update_data["books_genres"] = {"create": [{"genre_id": gid} for gid in genre_ids]}

    book = await prisma.book.update(
        where={"book_id": book_id},
        data=update_data,
        include=BOOK_INCLUDE,
    )
    return _serialize(book)


async def delete_book(book_id: int) -> None:
    await prisma.book.delete(where={"book_id": book_id})