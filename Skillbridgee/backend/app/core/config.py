from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Render provides DATABASE_URL automatically for Postgres
    DATABASE_URL: str = "sqlite:///./skillbridge.db"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Set this to your Vercel frontend URL in Render env vars
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()
