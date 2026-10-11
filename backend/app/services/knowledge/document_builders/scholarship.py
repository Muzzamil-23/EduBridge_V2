def build_scholarship_document(scholarship: dict) -> str:
    return f"""
Scholarship:
{scholarship.get("name", "")}

Type:
{scholarship.get("type", "")}

Status:
{"Currently active" if scholarship.get("active") else "Currently inactive"}

Description:
{scholarship.get("description", "")}
""".strip()