def build_university_document(university: dict) -> str:
    return f"""
University: {university.get("university_name","")}

About:
{university.get("about","")}

University Type:
{university.get("type", "")}

City:
{university.get("city", "")}

Facilities:
Hostel: {"Available" if university.get("has_hostel")  else "Not available"}
Transport: {"Available" if university.get("has_transport")  else "Not available"}

Extracurricular Activities:
{university.get("extracurriculars", "")}

Established:
{university.get("established", "")}
""".strip()
