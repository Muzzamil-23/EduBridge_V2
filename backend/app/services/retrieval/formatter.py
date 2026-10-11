from app.schemas.retrieval import RetrievalResult


MAX_CONTEXT_CHARS = 12000


def _format_percentage(value) -> str:
    if value is None:
        return "Not specified"

    if isinstance(value, (int, float)):
        if 0 <= value <= 1:
            return f"{value * 100:.2f}%"

        return f"{value:.2f}%"

    return str(value)


def _format_boolean(value) -> str:
    if value is None:
        return "Not specified"

    return "Yes" if value else "No"


def _format_value(value) -> str:
    if value is None:
        return "Not specified"

    return str(value)


def format_retrieval_context(
    semantic_results: list[RetrievalResult] | None = None,
    structured_results: list[dict] | None = None,
    max_chars: int = MAX_CONTEXT_CHARS,
) -> str:
    context_parts = []

    for result in semantic_results or []:
        context_parts.append(
            f"""
Source:
{result.content}
""".strip()
        )

    for result in structured_results or []:
        university = result.get("universities") or {}
        features = result.get("university_program_features") or []
        feature = features[0] if features else {}

        context_parts.append(
            f"""
University:
{_format_value(university.get("university_name"))}

University Type:
{_format_value(university.get("type"))}

City:
{_format_value(university.get("city"))}

Program:
{_format_value(result.get("program_name"))}

Program Group:
{_format_value(result.get("program_group"))}

Admission Requirements:
Minimum academic percentage: {
    _format_percentage(feature.get("min_academic_percent"))
}
Entry test required: {
    _format_boolean(feature.get("entry_test_required"))
}
Minimum test score: {
    _format_percentage(feature.get("min_test_score"))
}

Facilities:
Hostel available: {
    _format_boolean(university.get("has_hostel"))
}
Transport available: {
    _format_boolean(university.get("has_transport"))
}

Fees:
Admission fee: Rs. {
    _format_value(feature.get("admission_fee"))
}
Semester fee: Rs. {
    _format_value(feature.get("semester_fee"))
}
Fee per credit hour: Rs. {
    _format_value(feature.get("fee_per_credit_hr"))
}

Credit Hours:
{_format_value(feature.get("credit_hours"))}
""".strip()
        )

    if not context_parts:
        return "No relevant information was found."

    context = "\n\n---\n\n".join(context_parts)

    if len(context) <= max_chars:
        return context

    truncated_context = context[:max_chars]

    return (
        truncated_context
        + "\n\n---\n\n"
        "Additional retrieved information was omitted "
        "because the context limit was reached."
    )