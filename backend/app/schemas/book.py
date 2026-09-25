from datetime import date
from pydantic import BaseModel, Field

from backend.app.schemas.author import AuthorOut
from backend.app.schemas.genre import GenreOut


class BookShortOut(BaseModel):
    book_id: int
    name: str
    image_url: str | None = None
    author: AuthorOut


class BookDetailOut(BookShortOut):
    description: str
    publishing_date: date
    read_url: str | None = None
    genres: list[GenreOut] = []


class BookCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    author_id: int
    description: str = Field(min_length=1)
    publishing_date: date
    image_url: str | None = None
    read_url: str | None = None
    genre_ids: list[int] = []


class BookUpdateIn(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    author_id: int | None = None
    description: str | None = None
    publishing_date: date | None = None
    image_url: str | None = None
    read_url: str | None = None
    genre_ids: list[int] | None = None