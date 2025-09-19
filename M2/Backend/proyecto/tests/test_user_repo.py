import pytest
from repositories.user_repository import UserRepository

@pytest.fixture
def user_repo():
    return UserRepository()

def test_create_user_success(user_repo):
    user = user_repo.create("testuser", "test@example.com", "password123", "user")
    assert user is not None

def _create_user_failure(user_repo):
    user = user_repo.create(None, None, None, None)
    assert user is None

def test_read_user_success(user_repo):
    user = user_repo.read("testuser", "password123")
    assert user is not None
    assert len(user) > 0
    assert user[0]["username"] == "testuser"

def test_read_user_failure(user_repo):
    user = user_repo.read("invaliduser", "wrongpassword")
    assert user is None

def test_read_by_id_success(user_repo):
    user = user_repo.read_by_id(6)
    assert user is not None
    assert user["id"] == 6

def test_read_by_id_failure(user_repo):
    user = user_repo.read_by_id(999)
    assert user is None

def test_delete_user_success(user_repo):
    result = user_repo.delete(6)
    assert result is True

def test_delete_user_failure(user_repo):
    result = user_repo.delete(999)
    assert result is False