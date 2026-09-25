from pydantic import BaseModel


class GenreOut(BaseModel):
    genre_id: int
    name: str