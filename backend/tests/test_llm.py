from app.services.ai.llm.groq import GroqLLMProvider


def test_groq_provider():
    provider = GroqLLMProvider()

    assert provider.client is not None
    assert provider.model_name