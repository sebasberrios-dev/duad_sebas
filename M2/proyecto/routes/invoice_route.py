from flask import Blueprint, request, jsonify
from authorization.auth import require_auth, require_role
from repositories.invoice_repository import InvoiceRepository
from repositories.cart_repository import CartRepository
from repositories.product_repository import ProductRepository
from routes.controller import Controller
from cache.cache_manager import CacheManager

invoice_bp = Blueprint('invoice_bp', __name__)
invoice_repo = InvoiceRepository()
cart_repo = CartRepository()
product_repo = ProductRepository()
cache_manager = CacheManager(host="PLACEHOLDER_FOR_HOST",
                             port="PLACEHOLDER_FOR_PORT",
                             password="PLACEHOLDER_FOR_PASSWORD")

@invoice_bp.route("/checkout", methods=['POST'])
@require_auth
def checkout():
    try:
        data = request.get_json()
        cart_id = data.get("cart_id")
        address = data.get("address")
        payment_details = data.get("payment_details")
        issue_date = data.get("issue_date")
        products = cart_repo.read_products_in_cart(cart_id)
        total = 0
        for product in products:
            product_id = product.get('product_id')
            quantity = product.get('quantity', 1)
            product_info = product_repo.read_by_id(product_id)
            price = product_info.get('price', 0) if product_info else 0
            total += price * quantity
        if not cart_id or not address or not payment_details or not issue_date or total == 0:
            return jsonify({"error": "Missing required fields or invalid total"}), 400
        
        invoice = invoice_repo.create(cart_id, address, payment_details, issue_date, total)
        if invoice:
            new_status = {"status": "completed"}
            cart_repo.update(cart_id, new_status)
            for product in products:
                product_id = product.get('product_id')
                quantity = product.get('quantity', 1)
                stock = product_repo.read_by_id(product_id)
                if stock and stock['stock'] >= quantity:
                    product_repo.update(product_id, {"stock": stock['stock'] - quantity})                    
            cache_manager.delete_data("invoices")
            return jsonify({"message": "Invoice created successfully", "invoice_id": invoice.id}), 201
        else:
            return jsonify({"error": "Failed to create invoice"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoice_bp.route("/invoices", methods=['GET'])
@require_role('admin')
def get_invoices():
    try:
        def query_db():
            invoices = invoice_repo.read()
            if not invoices:
                return None
            invoices_list = Controller.serialize_list(invoices, date_fields=["issue_date"])
            return invoices_list or None
        invoices = cache_manager.cache_or_query("invoices", query_db, expiration=120)
        if invoices is None:
            return jsonify({"error": "No invoices found"}), 404
        return jsonify(invoices), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoice_bp.route("/invoices/<int:invoice_id>", methods=['GET'])
@require_auth
def get_invoice(invoice_id):
    try:
        def query_db():
            invoice = invoice_repo.read_by_id(invoice_id)
            if invoice:
                return Controller.serialize_row(invoice, date_fields=["issue_date"])
            return None
        invoice = cache_manager.cache_or_query(f"invoice_{invoice_id}", query_db, expiration=120)
        if invoice is None:
            return jsonify({"error": "Invoice not found"}), 404
        return jsonify(invoice), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoice_bp.route("/invoices/<int:invoice_id>", methods=['DELETE'])
@require_role('admin')
def delete_invoice(invoice_id):
    try:
        invoice = invoice_repo.read_by_id(invoice_id)
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
        invoice_repo.delete(invoice_id)
        cache_manager.delete_data(f"invoice_{invoice_id}")
        cache_manager.delete_data("invoices")
        return jsonify({"message": "Invoice deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoice_bp.route("/refund/<int:invoice_id>", methods=['POST'])
@require_auth
def refund_invoice(invoice_id):
    try:
        invoice = invoice_repo.read_by_id(invoice_id)
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
        cart_id = invoice['cart_id']
        products = cart_repo.read_products_in_cart(cart_id)
        for product in products:
            product_id = product.get('product_id')
            quantity = product.get('quantity', 1)
            if stock := product_repo.read_by_id(product_id):
                product_repo.update(product_id, {"stock": stock['stock'] + quantity})
        new_status = {"status": "refunded"}
        cart_repo.update(cart_id, new_status)
        return jsonify({"message": "Invoice refunded successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500