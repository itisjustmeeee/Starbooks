from fastapi import APIRouter

from backend.app.api.v1.routes import user_books
from backend.app.api.v1.routes.admin import books as admin_books
from backend.app.api.v1.routes.admin import users as admin_users
from backend.app.api.v1.routes import auth, catalog, profile

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(catalog.router)
api_router.include_router(user_books.router)
api_router.include_router(profile.router)
api_router.include_router(admin_users.router)
api_router.include_router(admin_books.router)