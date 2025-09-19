import pytest
from repositories.product_repository import ProductRepository

@pytest.fixture
def product_repo():
    return ProductRepository()

def test_create_product_success(product_repo):
    result = product_repo.create("Test Product", 19.99, 10, "2-9-2025")
    assert result is not None

def _create_product_failure(product_repo):
    result = product_repo.create("", 0, "")
    assert result is None

def test_read_product_success(product_repo):
    result = product_repo.read()
    assert result is not None
    assert len(result) > 0
    assert result[0]["name"] == "Test Product"

def test_read_product_by_id_success(product_repo):
    result = product_repo.read_by_id(1)
    assert result is not None
    assert result["id"] == 1
    assert result["name"] == "Test Product"

def test_read_product_by_id_failure(product_repo):
    result = product_repo.read_by_id(999)
    assert result is None

def test_update_product_success(product_repo):
    updated_fields = {"price": 24.99, "stock": 5}
    result = product_repo.update(1, updated_fields)
    assert result is True

def test_update_product_failure(product_repo):
    updated_fields = {"price": 24.99, "stock": 5}
    result = product_repo.update(999, updated_fields)
    assert result is False

def test_delete_product_success(product_repo):
    result = product_repo.delete(1)
    assert result is True

def test_delete_product_failure(product_repo):
    result = product_repo.delete(999)
    assert result is False