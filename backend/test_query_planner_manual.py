
from app.services.ai.llm.groq import GroqLLMProvider
from app.services.ai.prompting.query import (
    QUERY_REWRITE_SYSTEM_PROMPT,
    build_query_rewrite_prompt,
)
from app.schemas.query import QueryPlan


queries = [
    "Which Computer Science programs are available in Karachi?",
    "Show me universities in Lahore with affordable CS programs.",
    "Why should I study Artificial Intelligence?",
    "What is the difference between Computer Science and Software Engineering?",
    "Which CS programs in Karachi are under 150k?",
    "I have 80% marks and want to study Data Science in Karachi.",
    "Tell me about scholarships for undergraduate students.",
    "Which universities have hostel facilities?",
    "Tell me about the weather in Karachi",
    "Write a python program for universities and features",
]


llm = GroqLLMProvider()

for query in queries:
    print("\n" + "=" * 70)
    print(f"QUERY: {query}")
    print("=" * 70)

    try:
        raw_response = llm.generate(
            system_prompt=QUERY_REWRITE_SYSTEM_PROMPT,
            user_prompt=build_query_rewrite_prompt(query),
        )

        print("\nRAW LLM RESPONSE:")
        print(raw_response)

        plan = QueryPlan.model_validate_json(raw_response)

        print("\nPARSED QUERY PLAN:")
        print(plan.model_dump_json(indent=2))

    except Exception as exc:
        print("\nERROR:")
        print(exc)
