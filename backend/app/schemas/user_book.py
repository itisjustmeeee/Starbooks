from pydantic import BaseModel

from backend.app.schemas.book import BookShortOut


class UserBookOut(BaseModel):
    books_status_id: int
    status: str
    book: BookShortOut


class UserBookCreateIn(BaseModel):
    book_id: int
    status: str = "Wanted"  # TODO: подтвердить дефолт


class UserBookStatusUpdateIn(BaseModel):
    status: str