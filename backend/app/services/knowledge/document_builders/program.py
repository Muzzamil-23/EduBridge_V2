def format_percentage(value) -> str:
    if value is None:
        return ""

    return f"{value * 100:.2f}".rstrip("0").rstrip(".")

def normalize_program_record(program: dict) -> dict:
    university = program.get("universities") or {}

    features = program.get("university_program_features") or []
    feature = features[0] if features else {}

    return {
        "university_name": university.get("university_name", ""),
        "university_type": university.get("type", ""),
        "city": university.get("city", ""),
        "program_name": program.get("program_name", ""),
        "program_group": program.get("program_group", ""),
        "min_academic_percent": feature.get("min_academic_percent"),
        "entry_test_required": feature.get("entry_test_required", False),
        "min_test_score": feature.get("min_test_score"),
        "admission_fee": feature.get("admission_fee"),
        "semester_fee": feature.get("semester_fee"),
        "fee_per_credit_hr": feature.get("fee_per_credit_hr"),
        "credit_hours": feature.get("credit_hours"),
    }


def build_program_document(program: dict) -> str:
    return f"""
University:
{program.get("university_name", "")}

University Type:
{program.get("university_type", "")}

City:
{program.get("city", "")}

Program:
{program.get("program_name", "")}

Program Group:
{program.get("program_group", "")}

Admission Requirements:
Minimum academic percentage: {format_percentage(program.get("min_academic_percent"))}%
Entry test required: {"Yes" if program.get("entry_test_required") else "No"}
Minimum test score: {format_percentage(program.get("min_test_score"))}%

Fees:
Admission fee: Rs. {program.get("admission_fee", "")}
Semester fee: Rs. {program.get("semester_fee", "")}
Fee per credit hour: Rs. {program.get("fee_per_credit_hr", "")}

Credit Hours:
{program.get("credit_hours", "")}
""".strip()