import pytest
from repositories.invoice_repository import InvoiceRepository

@pytest.fixture
def invoice_repo():
    return InvoiceRepository()

def test_create_invoice_success(invoice_repo):
    result = invoice_repo.create(1, "30 Bellgrove Drive", "60140707", "2-9-2025", 150.0)
    assert result is not None

def test_create_invoice_failure_missing_fields(invoice_repo):
    with pytest.raises(TypeError):
        invoice_repo.create(1, "30 Bellgrove Drive", "2-9-2025", 150.0)

def test_read_invoices_success(invoice_repo):
    result = invoice_repo.read()
    assert result[0]["id"] == 1
    assert result[0]["address"] == "30 Bellgrove Drive"
    assert str(result[0]["payment_details"]) == "60140707"
    assert result[0]["issue_date"].strftime("%Y-%m-%d") == "2025-09-02"
    assert result[0]["total"] == 150.0

def test_read_all_invoices_failure_using_id_as_parameter(invoice_repo):
    with pytest.raises(TypeError):
        invoice_repo.read(1)

def test_read_invoice_by_id_success(invoice_repo):
    result = invoice_repo.read_by_id(1)
    assert result["id"] == 1
    assert result["address"] == "30 Bellgrove Drive"
    assert str(result["payment_details"]) == "60140707"
    assert result["issue_date"].strftime("%Y-%m-%d") == "2025-09-02"
    assert result["total"] == 150.0

def test_read_invoice_by_id_failure_id_not_found(invoice_repo):
    result = invoice_repo.read_by_id(999)
    assert result is None

def test_update_invoice_success(invoice_repo):
    result = invoice_repo.update(1, {"address": "30 Bellgrove Drive", "total": 150.0})
    assert result is True

def test_update_invoice_failure_fields_not_found(invoice_repo):
    result = invoice_repo.update(1, {"non_existent_field": "value"})
    assert result is False

def test_delete_invoice_success(invoice_repo):
    result = invoice_repo.delete(1)
    assert result is True

def test_delete_invoice_failure_id_not_found(invoice_repo):
    result = invoice_repo.delete(999)
    assert result is False