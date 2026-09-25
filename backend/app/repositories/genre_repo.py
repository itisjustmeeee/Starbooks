from backend.app.db.prisma import prisma


async def get_many(ids: list[int]):
    return await prisma.genre.find_many(where={"genre_id": {"in": ids}})


async def list_all():
    return await prisma.genre.find_many(order={"name": "asc"})