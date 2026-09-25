from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.router import api_router
from backend.app.core.config import settings
from backend.app.db import prisma as prisma_module


@asynccontextmanager
async def lifespan(app: FastAPI):
    await prisma_module.connect()
    yield
    await prisma_module.disconnect()


app = FastAPI(title="Starbooks API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["system"])
async def health_check():
    """Проверка живости сервиса — удобно для docker healthcheck и мониторинга."""
    return {"status": "ok"}