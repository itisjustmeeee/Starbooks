from backend.app.db.generated import Prisma

prisma = Prisma()


async def connect() -> None:
    await prisma.connect()


async def disconnect() -> None:
    if prisma.is_connected():
        await prisma.disconnect()