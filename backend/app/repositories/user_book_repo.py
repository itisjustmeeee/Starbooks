from backend.app.db.prisma import prisma


USER_BOOK_INCLUDE = {
    "book": {"include": {"author": True}},
}


async def list_for_user(user_id: int):
    rows = await prisma.usersbooksstatus.find_many(
        where={"user_id": user_id},
        include=USER_BOOK_INCLUDE,
        order={"books_status_id": "desc"},
    )
    return rows


async def get(user_id: int, book_id: int):
    return await prisma.usersbooksstatus.find_unique(
        where={"user_id_book_id": {"user_id": user_id, "book_id": book_id}},
        include=USER_BOOK_INCLUDE,
    )


async def create(user_id: int, book_id: int, status: str):
    return await prisma.usersbooksstatus.create(
        data={"user_id": user_id, "book_id": book_id, "status": status},
        include=USER_BOOK_INCLUDE,
    )


async def update_status(user_id: int, book_id: int, status: str):
    return await prisma.usersbooksstatus.update(
        where={"user_id_book_id": {"user_id": user_id, "book_id": book_id}},
        data={"status": status},
        include=USER_BOOK_INCLUDE,
    )


async def delete(user_id: int, book_id: int) -> None:
    await prisma.usersbooksstatus.delete(
        where={"user_id_book_id": {"user_id": user_id, "book_id": book_id}}
    )