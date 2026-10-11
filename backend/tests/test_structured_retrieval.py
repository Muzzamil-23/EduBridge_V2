from app.services.retrieval.structured import StructuredRetriever


def make_result(
    *,
    city="Karachi",
    university_type="Private",
    program_name="Computer Science",
    program_group="Computer Science & IT",
    semester_fee=100000,
    academic_percent=0.5,
    test_score=0.5,
    entry_test=True,
    hostel=True,
    transport=True,
):
    return {
        "id": 1,
        "program_name": program_name,
        "program_group": program_group,
        "universities": {
            "uni_id": 100,
            "university_name": "Test University",
            "type": university_type,
            "city": city,
            "has_hostel": hostel,
            "has_transport": transport,
        },
        "university_program_features": [
            {
                "admission_fee": 10000,
                "semester_fee": semester_fee,
                "credit_hours": 130,
                "min_academic_percent": academic_percent,
                "min_test_score": test_score,
                "entry_test_required": entry_test,
                "fee_per_credit_hr": 5000,
            }
        ],
    }


class FakeQuery:
    def __init__(self, data):
        self.data = data

    def select(self, *_args, **_kwargs):
        return self

    def ilike(self, field, pattern):
        value = pattern.strip("%").lower()

        self.data = [
            result
            for result in self.data
            if value in str(result.get(field, "")).lower()
        ]

        return self

    def execute(self):
        class Response:
            pass

        response = Response()
        response.data = self.data

        return response


class FakeSupabase:
    def __init__(self, data):
        self.data = data

    def table(self, *_args, **_kwargs):
        return FakeQuery(self.data.copy())


def test_filters_by_city(monkeypatch):
    data = [
        make_result(city="Karachi"),
        make_result(city="Lahore"),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        city="Karachi"
    )

    assert len(results) == 1
    assert results[0]["universities"]["city"] == "Karachi"


def test_filters_by_program_name(monkeypatch):
    data = [
        make_result(program_name="Computer Science"),
        make_result(program_name="Business Administration"),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        program_name="Computer Science"
    )

    assert len(results) == 1
    assert results[0]["program_name"] == "Computer Science"


def test_filters_by_program_group(monkeypatch):
    data = [
        make_result(
            program_group="Computer Science & IT"
        ),
        make_result(
            program_group="Business & Management"
        ),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        program_group="Computer Science"
    )

    assert len(results) == 1
    assert (
        results[0]["program_group"]
        == "Computer Science & IT"
    )


def test_filters_by_university_type(monkeypatch):
    data = [
        make_result(university_type="Private"),
        make_result(university_type="Public"),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        university_type="Public"
    )

    assert len(results) == 1
    assert (
        results[0]["universities"]["type"]
        == "Public"
    )


def test_filters_by_max_fee(monkeypatch):
    data = [
        make_result(semester_fee=80000),
        make_result(semester_fee=150000),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        max_fee=100000
    )

    assert len(results) == 1
    assert (
        results[0]["university_program_features"][0][
            "semester_fee"
        ]
        == 80000
    )


def test_filters_by_academic_percentage_as_percent(monkeypatch):
    data = [
        make_result(academic_percent=0.7964),
        make_result(academic_percent=0.8364),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        academic_percentage=80
    )

    assert len(results) == 1
    assert (
        results[0]["university_program_features"][0][
            "min_academic_percent"
        ]
        == 0.7964
    )


def test_filters_by_academic_percentage_as_decimal(monkeypatch):
    data = [
        make_result(academic_percent=0.5),
        make_result(academic_percent=0.7),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        academic_percentage=0.6
    )

    assert len(results) == 1
    assert (
        results[0]["university_program_features"][0][
            "min_academic_percent"
        ]
        == 0.5
    )


def test_filters_by_test_score_as_percent(monkeypatch):
    data = [
        make_result(test_score=0.5),
        make_result(test_score=0.7),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        test_score=60
    )

    assert len(results) == 1
    assert (
        results[0]["university_program_features"][0][
            "min_test_score"
        ]
        == 0.5
    )


def test_filters_by_test_score_as_decimal(monkeypatch):
    data = [
        make_result(test_score=0.5),
        make_result(test_score=0.7),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        test_score=0.6
    )

    assert len(results) == 1
    assert (
        results[0]["university_program_features"][0][
            "min_test_score"
        ]
        == 0.5
    )


def test_filters_by_entry_test(monkeypatch):
    data = [
        make_result(entry_test=True),
        make_result(entry_test=False),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        entry_test_required=True
    )

    assert len(results) == 1
    assert (
        results[0]["university_program_features"][0][
            "entry_test_required"
        ]
        is True
    )


def test_filters_by_hostel_and_transport(monkeypatch):
    data = [
        make_result(
            hostel=True,
            transport=True,
        ),
        make_result(
            hostel=False,
            transport=True,
        ),
        make_result(
            hostel=True,
            transport=False,
        ),
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        needs_hostel=True,
        needs_transport=True,
    )

    assert len(results) == 1

    assert (
        results[0]["universities"]["has_hostel"]
        is True
    )

    assert (
        results[0]["universities"]["has_transport"]
        is True
    )


def test_applies_result_limit(monkeypatch):
    data = [
        make_result()
        for _ in range(30)
    ]

    monkeypatch.setattr(
        "app.services.retrieval.structured.supabase_admin",
        FakeSupabase(data),
    )

    retriever = StructuredRetriever()

    results = retriever.search_programs(
        limit=10
    )

    assert len(results) == 10