from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserOut(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime


class UserRegisterIn(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserNicknameUpdateIn(BaseModel):
    username: str = Field(min_length=3, max_length=100)


class UserPasswordUpdateIn(BaseModel):
    old_password: str
    new_password: str = Field(min_length=8, max_length=128)