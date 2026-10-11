from groq import Groq

from app.core.config import settings
from app.services.ai.llm.base import LLMProvider


class GroqLLMProvider(LLMProvider):

    def __init__(self):
        self.client = Groq(
            api_key=settings.groq_api_key
        )
        self.model = settings.groq_model

    @property
    def model_name(self) -> str:
        return self.model

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
        )

        return response.choices[0].message.content