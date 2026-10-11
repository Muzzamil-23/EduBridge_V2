from unittest.mock import MagicMock, patch

from app.repositories.student import StudentRepository


def create_query_mock(data):
    query = MagicMock()

    query.select.return_value = query
    query.eq.return_value = query
    query.maybe_single.return_value = query

    query.execute.return_value = MagicMock(
        data=data
    )

    return query


def test_get_profile_returns_combined_profile():
    personal_data = {
        "first_name": "Muhammad",
        "last_name": "Siddiqui",
        "email": "test@example.com",
        "age": 21,
    }

    academic_data = {
        "preferred_university_type": "Private",
        "preferred_program_group": "Computer Science / IT",
        "per_semester_budget": 100000,
        "scholarship_requirement": False,
        "hostel_requirement": True,
        "transport_requirement": True,
        "specific_universities": "FAST,NED",
        "entry_test_requirement": True,
        "academic_percentage": 82,
    }

    personal_query = create_query_mock(personal_data)
    academic_query = create_query_mock(academic_data)

    mock_client = MagicMock()

    mock_client.table.side_effect = [
        personal_query,
        academic_query,
    ]

    with patch(
        "app.repositories.student.supabase_admin",
        mock_client,
    ):
        repository = StudentRepository()

        profile = repository.get_profile("user-123")

    assert profile is not None

    assert profile["first_name"] == "Muhammad"
    assert profile["last_name"] == "Siddiqui"
    assert profile["email"] == "test@example.com"
    assert profile["age"] == 21

    assert profile["preferred_university_type"] == "Private"
    assert profile["preferred_program_group"] == "Computer Science / IT"
    assert profile["per_semester_budget"] == 100000
    assert profile["academic_percentage"] == 82
    assert profile["hostel_requirement"] is True
    assert profile["transport_requirement"] is True
    assert profile["specific_universities"] == "FAST,NED"


def test_get_profile_returns_none_when_no_data():
    personal_query = create_query_mock(None)
    academic_query = create_query_mock(None)

    mock_client = MagicMock()

    mock_client.table.side_effect = [
        personal_query,
        academic_query,
    ]

    with patch(
        "app.repositories.student.supabase_admin",
        mock_client,
    ):
        repository = StudentRepository()

        profile = repository.get_profile("user-123")

    assert profile is None
