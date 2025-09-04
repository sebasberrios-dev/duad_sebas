from flask import request, jsonify, Blueprint
from authorization.jwt_manager import JWTManager
from authorization.auth import require_auth, require_role
from repositories.product_repository import ProductRepository
from cache.cache_manager import CacheManager

product_bp = Blueprint('product_bp', __name__)
product_repo = ProductRepository()
jwt_manager = JWTManager('trespatitos', 'HS256')
cache_manager = CacheManager("PLACEHOLDER_FOR_REDIS_URL")

@product_bp.route("/create_product", methods=['POST'])
@require_role('admin')
def create_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    stock = data.get('stock')
    entry_date = data.get('entry_date')

    if not name or not price or not stock or not entry_date:
        return jsonify({"error": "Missing data to create product"}), 400
    try:
        if product_repo.create(name, price, stock, entry_date):
            cache_manager.delete_data("products")
            return jsonify({"message": "Product created successfully."}), 201
        else:
            return jsonify({"error": "Could not create product"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@product_bp.route("/products", methods=['GET'])
@require_auth
def get_products():
    try:
        id_filter = request.args.get('id')
        def query_db():
            products = product_repo.read()
            if not products:
                return None
            products_list = []
            for p in products:
                prod_dict = dict(p)
                if "entry_date" in prod_dict and hasattr(prod_dict["entry_date"], "strftime"):
                    prod_dict["entry_date"] = prod_dict["entry_date"].strftime("%Y-%m-%d")
                products_list.append(prod_dict)
            if id_filter:
                products_list = [p for p in products_list if str(p['id']) == id_filter]
            return products_list if products_list else None
        products = cache_manager.cache_or_query("products", query_db, expiration=120)
        if products is None:
            return jsonify({"error": "No products available"}), 404
        return jsonify(products), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route("/products/<int:product_id>", methods=['POST'])
@require_role('admin')
def update_product(product_id):
    data = request.get_json()
    updated_fields = {k: v for k, v in data.items() if v is not None}

    if not updated_fields:
        return jsonify({"error": "No fields to update"}), 400
    try:
        if product_repo.update(product_id, updated_fields):
            cache_manager.delete_data("products")
            return jsonify({"message": "Product updated successfully."}), 200
        else:
            return jsonify({"error": "Could not update product"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route("/products/<int:product_id>", methods=['DELETE'])
@require_role('admin')
def delete_product(product_id):
    try:
        if product_repo.delete(product_id):
            cache_manager.delete_data("products")
            return jsonify({"message": "Product deleted successfully."}), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500