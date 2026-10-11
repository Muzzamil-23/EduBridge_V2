import json

from app.schemas.recommendation import RecommendationReasoning


class RecommendationReasoner:

    def __init__(self, llm_provider):
        self.llm_provider = llm_provider

    # ==========================================================
    # System Prompt
    # ==========================================================

    def _build_system_prompt(self) -> str:
        return """
You are the AI reasoning component of EduBridge.

Your job is to explain why each provided university program fits
the student's profile.

STRICT RULES:

1. Use ONLY facts provided in the input.
2. Never invent facts.
3. The fit_label is already determined by the backend.
4. NEVER change the provided fit_label.
5. Generate exactly one object for EVERY program.
6. NEVER skip a program, even if some fields are null.
7. NEVER merge multiple programs into one object.
8. NEVER duplicate a program.
9. Preserve the exact input order.
10. The number of output objects MUST exactly equal the number
    of input programs.
11. Keep ALL text extremely concise.
12. Return ONLY valid JSON.
13. Do NOT use Markdown.
14. Do NOT use code fences.
15. Do NOT add explanations outside the JSON array.

OUTPUT LIMITS:

- reasoning: maximum 20 words.
- reasons: maximum 3 short items.
- concerns: maximum 2 short items.
- decision_factors: maximum 2 short items.
- next_actions: maximum 2 short items.
- evidence_fields: maximum 4 factual fields.

Concerns:
- Only mention concerns supported by the input.
- Academic proximity, budget proximity, or a provided facility
  mismatch may be mentioned.
- Do not invent concerns about reputation, careers, competition,
  workload, admission difficulty, or future fees.

Allowed fit labels:
- Strong Fit
- Good Fit
- Moderate Fit

Each object MUST have exactly these fields:

{
  "fit_label": "...",
  "reasoning": "...",
  "reasons": [],
  "concerns": [],
  "decision_factors": [],
  "next_actions": [],
  "evidence_fields": {}
}
"""

    # ==========================================================
    # Single Program Reasoning
    # ==========================================================

    def generate_reasoning(
        self,
        program: dict,
        profile: dict,
    ) -> RecommendationReasoning:

        system_prompt = self._build_system_prompt()

        user_prompt = self._build_user_prompt(
            program=program,
            profile=profile,
        )

        response = self.llm_provider.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )

        return self._parse_response(response)

    # ==========================================================
    # Batch Reasoning
    # ==========================================================

    def generate_batch_reasoning(
        self,
        programs: list[dict],
        profile: dict,
    ) -> list[RecommendationReasoning]:

        system_prompt = self._build_system_prompt()

        user_prompt = self._build_batch_user_prompt(
            programs=programs,
            profile=profile,
        )

        response = self.llm_provider.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )

        return self._parse_batch_response(response)

    # ==========================================================
    # Normalize Program
    # ==========================================================

    def _normalize_program(
        self,
        program: dict,
    ) -> dict:

        university = (
            program.get("university")
            or program.get("universities")
            or {}
        )

        features = program.get("features")

        if not features:
            features = program.get(
                "university_program_features"
            )

        if isinstance(features, list):
            features = features[0] if features else {}

        features = features or {}

        return {
            "id": program.get("id"),
            "program_name": program.get("program_name"),
            "program_group": program.get("program_group"),
            "university_name": university.get(
                "university_name"
            ),
            "university_type": university.get("type"),
            "city": university.get("city"),
            "semester_fee": features.get("semester_fee"),
            "min_academic_percent": features.get(
                "min_academic_percent"
            ),
            "min_test_score": features.get(
                "min_test_score"
            ),
            "entry_test_required": features.get(
                "entry_test_required"
            ),
            "has_hostel": university.get("has_hostel"),
            "has_transport": university.get(
                "has_transport"
            ),
            "academic_difference": program.get(
                "academic_difference"
            ),
            "fit_label": program.get("fit_label"),
        }

    # ==========================================================
    # Normalize Profile
    # ==========================================================

    def _normalize_profile(
        self,
        profile: dict,
    ) -> dict:

        return {
            "preferred_university_type": profile.get(
                "preferred_university_type"
            ),
            "preferred_program_group": profile.get(
                "preferred_program_group"
            ),
            "per_semester_budget": profile.get(
                "per_semester_budget"
            ),
            "hostel_requirement": profile.get(
                "hostel_requirement"
            ),
            "transport_requirement": profile.get(
                "transport_requirement"
            ),
            "entry_test_requirement": profile.get(
                "entry_test_requirement"
            ),
            "academic_percentage": profile.get(
                "academic_percentage"
            ),
        }

    # ==========================================================
    # Single Program Prompt
    # ==========================================================

    def _build_user_prompt(
        self,
        program: dict,
        profile: dict,
    ) -> str:

        compact_profile = self._normalize_profile(
            profile
        )

        compact_program = self._normalize_program(
            program
        )

        return (
            "Student:\n"
            f"{json.dumps(compact_profile, separators=(',', ':'))}\n\n"
            "Program:\n"
            f"{json.dumps(compact_program, separators=(',', ':'))}\n\n"
            "Return exactly one JSON object."
        )

    # ==========================================================
    # Batch Prompt
    # ==========================================================

    def _build_batch_user_prompt(
        self,
        programs: list[dict],
        profile: dict,
    ) -> str:

        compact_profile = self._normalize_profile(
            profile
        )

        compact_programs = [
            self._normalize_program(program)
            for program in programs
        ]

        return (
            "Student:\n"
            f"{json.dumps(compact_profile, separators=(',', ':'))}\n\n"
            "Programs:\n"
            f"{json.dumps(compact_programs, separators=(',', ':'))}\n\n"
            f"IMPORTANT: There are exactly {len(programs)} programs.\n"
            f"You MUST return exactly {len(programs)} JSON objects.\n"
            "Create one object for every program ID provided.\n"
            "Do not skip, merge, duplicate, or remove any program.\n"
            "Keep the exact program order.\n"
            "The number of output objects MUST match the number "
            "of input programs.\n"
            "Keep every field extremely short.\n"
            "Return ONLY the JSON array."
        )

    # ==========================================================
    # Parse Single Response
    # ==========================================================

    def _parse_response(
        self,
        response: str,
    ) -> RecommendationReasoning:

        response = response.strip()

        # Remove Markdown code fences if present.
        if response.startswith("```"):
            lines = response.splitlines()

            lines = lines[1:]

            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]

            response = "\n".join(lines).strip()

        try:
            parsed = json.loads(response)

        except json.JSONDecodeError as exc:

            print("RAW LLM RESPONSE:")
            print(response)

            raise ValueError(
                "LLM returned invalid JSON."
            ) from exc

        return RecommendationReasoning.model_validate(
            parsed
        )

    # ==========================================================
    # Parse Batch Response
    # ==========================================================

    def _parse_batch_response(
        self,
        response: str,
    ) -> list[RecommendationReasoning]:

        response = response.strip()

        # Remove Markdown code fences.
        if response.startswith("```"):
            lines = response.splitlines()

            lines = lines[1:]

            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]

            response = "\n".join(lines).strip()

        # Try normal JSON parsing.
        try:
            parsed = json.loads(response)

        except json.JSONDecodeError:

            # Try extracting the JSON array.
            start = response.find("[")
            end = response.rfind("]")

            if start == -1 or end == -1 or end <= start:

                print("RAW LLM RESPONSE:")
                print(response)

                raise ValueError(
                    "LLM returned invalid JSON."
                )

            json_text = response[start:end + 1]

            try:
                parsed = json.loads(json_text)

            except json.JSONDecodeError as exc:

                print("RAW LLM RESPONSE:")
                print(response)

                raise ValueError(
                    "LLM returned invalid JSON."
                ) from exc

        # Validate array.
        if not isinstance(parsed, list):

            print("RAW LLM RESPONSE:")
            print(response)

            raise ValueError(
                "LLM batch response must be a JSON array."
            )

        # Validate every object.
        results = []

        for index, item in enumerate(parsed):

            try:
                result = (
                    RecommendationReasoning
                    .model_validate(item)
                )

            except Exception as exc:

                print(
                    f"INVALID LLM ITEM AT INDEX {index}:"
                )
                print(item)

                raise ValueError(
                    "LLM returned an invalid "
                    "recommendation object."
                ) from exc

            results.append(result)

        return results




