from pydantic import BaseModel


class AuthorOut(BaseModel):
    author_id: int
    name: str
    surname: str
    image_url: str | None = None