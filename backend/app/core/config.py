from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    supabase_url: str
    supabase_publishable_key: str
    supabase_secret_key: str

    huggingface_api_key: str

    groq_api_key: str
    groq_model: str

    embedding_model: str = "Qwen/Qwen3-Embedding-0.6B"

    advisor_daily_limit: int = 4

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()