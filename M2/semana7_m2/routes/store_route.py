from repositories.products_repository import ProductRepository
from repositories.invoices_repository import InvoiceRepository
from jwt_manager import JWTManager
from datetime import datetime
from flask import request, jsonify, Blueprint, Response
from authorization import require_auth, require_role

store_bp = Blueprint('store_bp', __name__)
product_repo = ProductRepository()
invoice_repo = InvoiceRepository()
jwt_manager = JWTManager('trespatitos', 'HS256')


@store_bp.route("/create_product", methods=['POST'])
@require_role('admin')
def create_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    entry_date = data.get('entry_date')
    quantity = data.get('quantity')

    if not name or not price or not entry_date or not quantity:
        return Response(status=400)

    try:
        if product_repo.create(name, price, entry_date, quantity):
            return jsonify({"message": "Producto creado correctamente."}), 201
        else:
            return jsonify({"error": "No se pudo crear el producto"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@store_bp.route("/products", methods=['GET'])
@require_auth
def get_products():
    try:
        filtered_products = product_repo.read()
        id_filter = request.args.get('id')

        if filtered_products:
            if id_filter:
                filtered_products = [dict(p) for p in filtered_products if str(p.id) == id_filter]

        if not filtered_products:
            return jsonify({"error": "No hay productos disponibles"}), 400

        return jsonify([dict(p) for p in filtered_products])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@store_bp.route("/buy", methods=['POST'])
@require_auth
def buy():
    data = request.get_json()
    product_id = int(data.get('product_id'))
    quantity = int(data.get('quantity'))

    if not product_id or not quantity:
        return Response(status=400)

    try:
        product = product_repo.read_by_id(product_id)
        if product is None:
            return jsonify({"error": "Producto no encontrado"}), 404
        
        total = product["price"] * quantity

        invoice = invoice_repo.create(
            request.user['id'],
            product_id,
            total=total,
            date_created=datetime.now().date()
        )
        if invoice is None:
            return jsonify({"error": "No se pudo crear la factura"}), 400

        return jsonify({"message": "Factura creada correctamente.", 
                        "invoice": dict(invoice)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@store_bp.route("/invoices", methods=['GET'])
@require_role('admin')
def get_invoices():
    try:
        invoices = invoice_repo.read()
        if invoices is None:
            return jsonify({"error": "No hay facturas disponibles"}), 400
        return jsonify([dict(invoice) for invoice in invoices])
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@store_bp.route("/invoices/<int:user_id>", methods=['GET'])
@require_auth
def get_invoices_by_user(user_id):
    try:
        invoices = invoice_repo.read_by_user_id(user_id)
        if invoices is None:
            return jsonify({"error": "No hay facturas para este usuario"}), 404
        return jsonify([dict(invoice) for invoice in invoices])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


