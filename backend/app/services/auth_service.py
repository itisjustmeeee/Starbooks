from backend.app.core.exceptions import ConflictError, UnauthorizedError
from backend.app.core.security import create_access_token, create_refresh_token, verify_password
from backend.app.repositories import user_repo


async def register(username: str, email: str, password: str):
    if await user_repo.get_by_username(username):
        raise ConflictError("Username already taken")
    if await user_repo.get_by_email(email):
        raise ConflictError("Email already registered")
    return await user_repo.create(username, email, password)


async def authenticate(username: str, password: str):
    user = await user_repo.get_by_username(username)
    if not user or not verify_password(password, user.password_hash):
        raise UnauthorizedError("Incorrect username or password")
    return user


def issue_tokens(user) -> dict:
    return {
        "access_token": create_access_token(user.user_id, user.role),
        "refresh_token": create_refresh_token(user.user_id, user.role),
        "token_type": "bearer",
    }