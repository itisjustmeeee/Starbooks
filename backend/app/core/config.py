from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # DB
    database_url: str

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_ttl_minutes: int = 30
    refresh_token_ttl_days: int = 30

    # CORS
    cors_origins: list[str] = ["http://localhost:5173"]

    # App
    api_v1_prefix: str = "/api/v1"
    debug: bool = False


settings = Settings()