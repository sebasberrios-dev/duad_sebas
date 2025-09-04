from flask import request, jsonify, Blueprint
from authorization.auth import require_auth
from repositories.product_repository import ProductRepository
from repositories.cart_repository import CartRepository
from repositories.invoice_repository import InvoiceRepository

cart_bp = Blueprint('cart_bp', __name__)
product_repo = ProductRepository()
cart_repo = CartRepository()
invoice_repo = InvoiceRepository()

@cart_bp.route("/cart", methods=['POST'])
@require_auth
def create_cart():
    user_id = request.user['id']
    data = request.get_json()
    cart_status = data.get('status', 'active')
    try:
        if cart_repo.create(user_id, cart_status):
            return jsonify({"message": "Cart created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@cart_bp.route("/cart/<int:cart_id>/add_product", methods=['POST'])
@require_auth
def add_product_to_cart(cart_id):
    user_id = request.user['id']
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    stock = product_repo.read_by_id(product_id)
    cart = cart_repo.read_by_id(cart_id)

    if cart is None or cart['user_id'] != user_id:
        return jsonify({"error": "Cart not found or access denied"}), 404
    
    if stock is None:
        return jsonify({"error": "Product not found"}), 404
    
    if stock['stock'] < quantity:
        return jsonify({"error": "Insufficient stock"}), 400

    try:
        cart_repo.add_product(cart_id, product_id, quantity)
        return jsonify({"message": "Product added to cart successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cart_bp.route("/cart/<int:cart_id>/remove_product", methods=['POST'])
@require_auth
def remove_product_from_cart(cart_id):
    user_id = request.user['id']
    data = request.get_json()
    product_id = data.get('product_id')

    stock = product_repo.read_by_id(product_id)
    cart = cart_repo.read_by_id(cart_id)
    product_cart = cart_repo.read_product(cart_id, product_id)

    if cart is None or cart['user_id'] != user_id:
        return jsonify({"error": "Cart not found or access denied"}), 404

    if product_cart is None:
        return jsonify({"error": "Product not found in cart"}), 404

    if stock is None:
        return jsonify({"error": "Product not found"}), 404

    try:
        cart_repo.remove_product(cart_id, product_id)
        return jsonify({"message": "Product removed from cart successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cart_bp.route("/cart/<int:cart_id>/update_product", methods=['POST'])
@require_auth
def update_product_in_cart(cart_id):
    user_id = request.user['id']
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    stock = product_repo.read_by_id(product_id)
    cart = cart_repo.read_by_id(cart_id)
    product_cart = cart_repo.read_product(cart_id, product_id)

    if cart is None or cart['user_id'] != user_id:
        return jsonify({"error": "Cart not found or access denied"}), 404

    if product_cart is None:
        return jsonify({"error": "Product not found in cart"}), 404

    if stock is None:
        return jsonify({"error": "Product not found"}), 404

    if stock['stock'] < quantity:
        return jsonify({"error": "Insufficient stock"}), 400

    try:
        cart_repo.update_product(cart_id, product_id, quantity)
        return jsonify({"message": "Product updated in cart successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500