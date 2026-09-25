from backend.app.core.security import hash_password
from backend.app.db.prisma import prisma


async def get_by_id(user_id: int):
    return await prisma.user.find_unique(where={"user_id": user_id})


async def get_by_username(username: str):
    return await prisma.user.find_unique(where={"username": username})


async def get_by_email(email: str):
    return await prisma.user.find_unique(where={"email": email})


async def create(username: str, email: str, password: str):
    return await prisma.user.create(
        data={
            "username": username,
            "email": email,
            "password_hash": hash_password(password),
            "role": "User",
        }
    )


async def list_users(page: int = 1, limit: int = 20):
    total = await prisma.user.count()
    users = await prisma.user.find_many(
        skip=(page - 1) * limit, take=limit, order={"user_id": "asc"}
    )
    return users, total


async def update_username(user_id: int, username: str):
    return await prisma.user.update(where={"user_id": user_id}, data={"username": username})


async def update_password(user_id: int, new_password: str):
    return await prisma.user.update(
        where={"user_id": user_id},
        data={"password_hash": hash_password(new_password)},
    )


async def delete_user(user_id: int) -> None:
    await prisma.user.delete(where={"user_id": user_id})