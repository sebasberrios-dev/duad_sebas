import pytest
from repositories.cart_repository import CartRepository
@pytest.fixture
def cart_repo():
    return CartRepository()

def test_add_product_to_cart_success(cart_repo):
    result = cart_repo.add_product(1, 1, 2)
    assert result is not None

def test_add_product_to_cart_failure(cart_repo):
    result = cart_repo.add_product(99, 1, 2)
    assert result is None

def test_read_product_in_cart_success(cart_repo):
    result = cart_repo.read_products_in_cart(1)
    assert result is not None
    assert len(result) > 0
    assert result[0]["product_id"] == 1

def test_read_product_in_cart_failure(cart_repo):
    result = cart_repo.read_products_in_cart(99)
    assert len(result) == 0

def test_read_product_success(cart_repo):
    result = cart_repo.read_product(1, 1)
    assert result is not None
    assert result["product_id"] == 1

def test_read_product_failure(cart_repo):
    result = cart_repo.read_product(1, 99)
    assert result is None

def test_update_product_from_cart_success(cart_repo):
    result = cart_repo.update_product(1, 1, 3)
    assert result is True

def test_update_product_from_cart_failure(cart_repo):
    result = cart_repo.update_product(1, 99, 3)
    assert result is False

def test_remove_product_from_cart_success(cart_repo):
    result = cart_repo.remove_product(1, 1)
    assert result is True

def test_remove_product_from_cart_failure(cart_repo):
    result = cart_repo.remove_product(1, 99)
    assert result is False