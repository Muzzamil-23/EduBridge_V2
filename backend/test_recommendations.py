from app.repositories.catalog import CatalogRepository


repo = CatalogRepository()
programs = repo.get_programs()

profile = {
    "preferred_university_type": "Private",
    "preferred_program_group": "Computer Science & IT",
    "per_semester_budget": 150000,
    "scholarship_requirement": False,
    "hostel_requirement": False,
    "transport_requirement": False,
    "specific_universities": None,
    "entry_test_requirement": False,
    "academic_percentage": 75,
}

print("Total programs:", len(programs))

current = programs

filters = [
    (
        "University type",
        lambda p: (
            not profile["preferred_university_type"]
            or (p.get("universities") or {}).get("type", "").strip().lower()
            == profile["preferred_university_type"].strip().lower()
        ),
    ),
    (
        "Program group",
        lambda p: (
            not profile["preferred_program_group"]
            or (p.get("program_group") or "").strip().lower()
            == profile["preferred_program_group"].strip().lower()
        ),
    ),
    (
        "Budget",
        lambda p: (
            profile["per_semester_budget"] is None
            or (
                (p.get("university_program_features") or [{}])[0]
                .get("semester_fee") is not None
                and float(
                    (p.get("university_program_features") or [{}])[0]
                    .get("semester_fee")
                )
                <= float(profile["per_semester_budget"])
            )
        ),
    ),
    (
        "Academic",
        lambda p: (
            profile["academic_percentage"] is None
            or (
                (p.get("university_program_features") or [{}])[0]
                .get("min_academic_percent") is None
                or float(profile["academic_percentage"])
                >= float(
                    (p.get("university_program_features") or [{}])[0]
                    .get("min_academic_percent")
                ) - 5
            )
        ),
    ),
]

for name, rule in filters:
    current = [program for program in current if rule(program)]
    print(f"{name}: {len(current)}")

print("\nFirst 10 remaining:")

for program in current[:10]:
    university = program.get("universities") or {}
    features = program.get("university_program_features") or [{}]

    if isinstance(features, list):
        features = features[0] if features else {}

    print(
        program["program_name"],
        "|",
        university.get("university_name"),
        "| Fee:",
        features.get("semester_fee"),
        "| Min academic:",
        features.get("min_academic_percent"),
    )