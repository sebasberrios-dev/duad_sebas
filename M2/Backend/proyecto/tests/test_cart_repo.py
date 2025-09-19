import pytest
from repositories.cart_repository import CartRepository 

@pytest.fixture
def cart_repo():
    return CartRepository()

def test_create_cart_success(cart_repo):
    result = cart_repo.create(1, 'active')
    assert result is not None

def test_create_cart_failure_user_not_found(cart_repo):
    result = cart_repo.create(99, 'active')
    assert result is None

def test_read_cart_success(cart_repo):
    result = cart_repo.read()
    assert result is not None
    assert len(result) > 0
    assert result[0]["user_id"] == 8

def test_read_cart_by_id_success(cart_repo):
    result = cart_repo.read_by_id(2)
    assert result is not None
    assert result["id"] == 2
    assert result["user_id"] == 8

def test_read_cart_by_id_failure(cart_repo):
    result = cart_repo.read_by_id(999)
    assert result is None

def test_read_cart_by_user_id_success(cart_repo):
    result = cart_repo.read_by_user_id(8)
    assert result is not None
    assert len(result) > 0
    assert result[0]["user_id"] == 8

def test_read_cart_by_user_id_failure(cart_repo):
    result = cart_repo.read_by_user_id(999)
    assert result is None

def test_update_cart_success(cart_repo):
    updated_fields = {"status": "closed"}
    result = cart_repo.update(2, updated_fields)
    assert result is True

def test_update_cart_failure_no_dict(cart_repo):
    new_status = "closed"
    result = cart_repo.update(2, new_status)
    assert result is False

def test_delete_cart_success(cart_repo):
    result = cart_repo.delete(2)
    assert result is True

def test_delete_cart_failure(cart_repo):
    result = cart_repo.delete(999)
    assert result is False