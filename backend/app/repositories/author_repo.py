from backend.app.db.prisma import prisma


async def get(author_id: int):
    return await prisma.author.find_unique(where={"author_id": author_id})


async def list_all():
    return await prisma.author.find_many(order={"surname": "asc"})