from flask import request, jsonify, Blueprint
from auth.auth import require_auth, require_role
from repositories.products_repo import ProductsRepository

products_bp = Blueprint('products', __name__)
products_repo = ProductsRepository()

@products_bp.route('/products', methods=['GET'])
@require_auth
def get_products():
    try:
        products = products_repo.read_all()
        filtered_products = [dict(p) for p in products if p['stock'] > 0]
        if not filtered_products:
            return jsonify({'message': 'no products found', 'products': []}), 200
        return jsonify(filtered_products), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
@require_auth
def get_product(product_id):
    try:
        product = products_repo.read_by_id(product_id)

        if not product:
            return jsonify({'message': 'product not found', 'product': None}), 200
        return jsonify(dict(product)), 200
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
@products_bp.route('/products', methods=['POST'])
@require_role('admin')
def create_product():
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        category = data.get('category')
        stock = data.get('stock')
        image_url = data.get('image_url')

        if not name or not description or not category or not image_url:
            return jsonify({'error': 'missing fields'}), 400

        if not isinstance(price, (int, float)) or price < 0:
            return jsonify({'error': 'invalid price'}), 400
        
        if not isinstance(stock, int) or stock < 0:
            return jsonify({'error': 'invalid stock'}), 400
        
        product = products_repo.create(name, description, price, category, stock, image_url)

        if product:
            return jsonify(dict(product)), 201
        
        else:
            raise Exception("Product creation failed")
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@products_bp.route('/products/update/<int:product_id>', methods=['PUT'])
@require_role('admin')
def update_product(product_id):
    try:
        data = request.get_json()
        update_data  = {k: v for k, v in data.items() if v is not None}

        if not update_data:
            return jsonify({'error': 'no fields to update'}), 400
        
        if products_repo.update(product_id, update_data):
            updated_product = products_repo.read_by_id(product_id)
            return jsonify(dict(updated_product)), 200
        
        else:
            return jsonify({'error': 'product not found'}), 404
        
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/reduce_stock/<int:product_id>', methods=['PUT'])
@require_auth
def reduce_stock(product_id):
    try:
        data = request.get_json()
        quantity = data.get('quantity')

        if quantity is None:
            return jsonify({'error': 'quantity is required'}), 400
        
        product = products_repo.read_by_id(product_id)
        if not product:
            return jsonify({'error': 'product not found'}), 404
        
        if product['stock'] < quantity:
            return jsonify({'error': 'insufficient stock'}), 409
        
        new_stock = product['stock'] - quantity

        if products_repo.update(product_id, {'stock': new_stock}):
            return jsonify({'message': 'stock reduced', 'new_stock': new_stock}), 200
        
        else:
            raise Exception("Failed to reduce stock")
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/delete/<int:product_id>', methods=['DELETE'])
@require_role('admin')
def delete_product(product_id):
    try:
        if products_repo.delete(product_id):
            return jsonify({'message': 'product deleted'}), 200
        
        else:
            return jsonify({'error': 'product not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500