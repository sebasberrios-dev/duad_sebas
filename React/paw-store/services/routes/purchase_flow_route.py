from flask import request, jsonify, Blueprint
from flask_mail import Message
from extensions import mail
from auth.auth import require_auth
from repositories.purchase_flow_repo import PurchaseFlowRepository
from repositories.products_repo import ProductsRepository

purchase_flow_bp = Blueprint('purchase_flow', __name__)
purchase_flow_repo = PurchaseFlowRepository()
products_repo = ProductsRepository()

@purchase_flow_bp.route('/cart/new', methods=['POST'])
@require_auth
def create_cart():
    try:
        user_id = request.user_id
        cart = purchase_flow_repo.create_cart(user_id)

        if cart:
            return jsonify({ 'message': 'cart created', 'cart': dict(cart) }), 201
        else:
            raise Exception("cart creation failed")
    
    except Exception as e:
        print(f"error creating cart: {e}")
        return jsonify({ 'error': 'cart creation failed' }), 500

@purchase_flow_bp.route('/cart', methods=['GET'])
@require_auth
def get_cart():
    try:
        user_id = request.user_id
        if user_id is None:
            return jsonify({'error': 'invalid or expired session, please login again'}), 401
        cart = purchase_flow_repo.get_cart(user_id)

        if cart:
            return jsonify({ 'cart': dict(cart) }), 200
        else:
            return jsonify({ 'message': 'cart not found', 'cart': None }), 200
    except Exception as e:
        print(f'error fetching cart: {e}')
        return jsonify({ 'error': 'fetching cart failed' }), 500
    
@purchase_flow_bp.route('/cart/products/<int:cart_id>', methods=['GET'])
@require_auth
def get_products_in_cart(cart_id):
    try:
        products_in_cart = purchase_flow_repo.get_products_in_cart(cart_id)

        if products_in_cart is not None:
            # Convert RowMapping objects to dicts for JSON serialization
            products_list = [dict(row) for row in products_in_cart]
            return jsonify({ 'products_in_cart': products_list }), 200
        else:
            return jsonify({ 'message': 'cart empty', 'products_in_cart': [] }), 200
    except Exception as e:
        print(f'error fetching cart: {e}')
        return jsonify({ 'error': 'fetching cart failed' }), 500

@purchase_flow_bp.route('/cart/add_product', methods=['POST'])
@require_auth
def add_product_to_cart():
    try:
        data = request.get_json() or {}
        user_id = request.user_id
        cart_id = data.get('cart_id')
        product_id = data.get('product_id')
        quantity = data.get('quantity')
        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return jsonify({ 'error': 'quantity must be an integer' }), 400

        check_cart = purchase_flow_repo.get_cart(user_id)
        if not check_cart:
            return jsonify({ 'error': 'cart not found' }), 404
        
        if cart_id is None or product_id is None or quantity is None:
            return jsonify({ 'error': 'missing required fields' }), 400
        
        if not isinstance(quantity, int):
            return jsonify({ 'error': 'quantity must be an integer' }), 400
        
        if quantity <= 0:
            return jsonify({ 'error': 'quantity must be greater than zero'}), 400

        duplicate_check = purchase_flow_repo.get_product_in_cart(cart_id, product_id)

        check_stock = products_repo.read_by_id(product_id)

        print(f'current stock for product {product_id}: {check_stock["stock"]}')

        if check_stock['stock'] < quantity:
            return jsonify({ 'error': 'insufficient stock' }), 400

        if duplicate_check:
            if check_stock['stock'] < quantity:
                return jsonify({ 'error': 'insufficient stock' }), 400

            updated_product = purchase_flow_repo.update_product_quantity_in_cart(cart_id, product_id, quantity)

            if updated_product:
                prod = dict(updated_product)
                prod['price'] = int(prod['price']) if prod.get('price') is not None else prod.get('price')
                prod['quantity'] = int(prod['quantity']) if prod.get('quantity') is not None else prod.get('quantity')
                return jsonify({ 'message': 'product quantity updated in cart', 'product': prod }), 200
            else:
                raise Exception("updating product quantity in cart failed")

        cart_product = purchase_flow_repo.add_product_to_cart(cart_id, product_id, quantity)

        if cart_product:
            prod = dict(cart_product)
            prod['price'] = int(prod['price']) if prod.get('price') is not None else prod.get('price')
            prod['quantity'] = int(prod['quantity']) if prod.get('quantity') is not None else prod.get('quantity')
            return jsonify({ 'message': 'product added to cart', 'product': prod }), 201
        else:
            raise Exception("adding product to cart failed")
    
    except Exception as e:
        print(f'error adding product to cart: {e}')
        return jsonify({ 'error': 'adding product to cart failed' }), 500
    
@purchase_flow_bp.route('/cart/remove_product', methods=['DELETE'])
@require_auth
def remove_product_from_cart():
    try:
        data = request.get_json() or {}
        user_id = request.user_id
        cart_id = data.get('cart_id')
        product_id = data.get('product_id')

        check_cart = purchase_flow_repo.get_cart(user_id)
        if not check_cart:
            return jsonify({ 'error': 'cart not found' }), 404
        
        if cart_id is None or product_id is None:
            return jsonify({ 'error': 'missing required fields'}), 400
        
        product_removed = purchase_flow_repo.remove_product_from_cart(cart_id, product_id)

        if product_removed is not None:
            if product_removed > 0:
                return jsonify({ 'message': 'product removed from cart' }), 200
            else:
                return jsonify({ 'error': 'product not found in cart' }), 404
        else:
            raise Exception("removing product from cart failed")
        
    except Exception as e:
        print(f'error removing product from cart: {e}')
        return jsonify({ 'error': 'removing product from cart failed' }), 500
    
@purchase_flow_bp.route('/order', methods=['POST'])
@require_auth
def create_order():
    try:
        data = request.get_json() or {}
        cart_id = data.get('cart_id')
        products = data.get('products')
        total_price = data.get('total_price')

        if not products or total_price is None:
            return jsonify({ 'error': 'missing required fields' }), 400
        if not isinstance(total_price, (int, float)) or total_price < 0:
            return jsonify({ 'error': 'invalid total price' }), 400
        
        order = purchase_flow_repo.create_order(cart_id, total_price, products)

        if order:
            return jsonify({ 'message': 'order created', 'order': dict(order) }), 201
        
        else:
            raise Exception("order creation failed")
        
    except Exception as e:
        print(f'error during checkout: {e}')
        return jsonify({ 'error': 'checkout failed' }), 500
    
@purchase_flow_bp.route('/checkout/billing_info', methods=['POST'])
@require_auth
def create_billing_info():
    try:
        data = request.get_json() or {}
        user_id = request.user_id
        order_id = data.get('order_id')
        full_name = data.get('full_name')
        email = data.get('email')
        shipping_address = data.get('shipping_address')
        phone_number = data.get('phone_number')

        if not all([order_id, full_name, email, shipping_address, phone_number]):
            return jsonify({ 'error': 'missing required fields' }), 400

        billing_info = purchase_flow_repo.create_billing_info(order_id, user_id, full_name, email, shipping_address, phone_number)

        if billing_info:
            return jsonify({ 'message': 'billing info created', 'billing_info': dict(billing_info) }), 201

        else:
            raise Exception("billing info creation failed")

    except Exception as e:
        print(f'error creating billing info: {e}')
        return jsonify({ 'error': 'creating billing info failed' }), 500    


@purchase_flow_bp.route('/orders/<int:order_id>', methods=['GET'])
@require_auth
def get_order(order_id):
    try:
        order = purchase_flow_repo.get_order(order_id)

        if order:
            return jsonify({ 'order': order}), 200
        
        else:
            return jsonify({ 'message': 'order not found', 'order': None}), 404
        
    except Exception as e:
        print(f'error fetching order: {e}')
        return jsonify({ 'error': 'fetching order failed' }), 500
    
@purchase_flow_bp.route('/checkout/complete_order/<int:order_id>', methods=['PUT'])
@require_auth
def complete_order(order_id):
    try:
        data = request.get_json() or {} 

        cart_id = data.get('cart_id')
        check_order = purchase_flow_repo.get_order(order_id)

        if not check_order:
            return jsonify({ 'error': 'order not found' }), 404
        
        if check_order['cart_id'] != cart_id:
            return jsonify({ 'error': 'unauthorized' }), 403
        
        new_status = 'completed'
        updated_rows = purchase_flow_repo.update_order_status(order_id, new_status)
        
        if updated_rows:
            updated_order = purchase_flow_repo.get_order(order_id)
            return jsonify({ 'message': 'checkout successful', 'order': dict(updated_order) }), 200
        else:
            return jsonify({ 'error': 'order not found or already completed' }), 409
    
    except Exception as e:
        print(f'error completing order: {e}')
        return jsonify({ 'error': 'completing order failed' }), 500

@purchase_flow_bp.route('/checkout/clear_cart/<int:cart_id>', methods=['DELETE'])
@require_auth
def clear_cart(cart_id):
    try:
        user_id = request.user_id
        cart = purchase_flow_repo.get_cart(user_id)

        if not cart:
            return jsonify({ 'error': 'cart not found' }), 404
        
        if cart['id'] != cart_id:
            return jsonify({ 'error': 'unauthorized' }), 403
        
        result = purchase_flow_repo.clear_cart(cart_id)
        if result is not None:
            return jsonify({ 'message': 'cart cleared' }), 200
        else:
            return jsonify({ 'error': 'cart not found or already cleared' }), 409
    except Exception as e:
        print(f'error clearing cart: {e}')
        return jsonify({ 'error': 'clearing cart failed' }), 500

@purchase_flow_bp.route('/most_purchased_products', methods=['GET'])
def get_most_purchased_products():
    try:
        limit = request.args.get('limit', default=5, type=int)
        products = purchase_flow_repo.get_most_purchased_products(limit)
        filtered_products = [dict(p) for p in products if p.get('stock', 0) > 0]
        print(filtered_products)
        return jsonify({ 'products': filtered_products }), 200
    
    except Exception as e:
        print(f'error fetching most purchased products: {e}')
        return jsonify({ 'error': 'fetching most purchased products failed' }), 500
    
@purchase_flow_bp.route('/send_order_confirmation', methods=['POST'])
@require_auth
def send_order_confirmation():
    try:
        data = request.get_json() or {}
        cart_id = data.get('cart_id')
        email = data.get('email')
        order_id = data.get('order_id')

        check_order = purchase_flow_repo.get_order(order_id)
        if not check_order:
            return jsonify({ 'error': 'order not found' }), 404

        if check_order['cart_id'] != cart_id:
            return jsonify({ 'error': 'unauthorized' }), 403

        if not email or not order_id:
            return jsonify({ 'error': 'missing required fields' }), 400
        
        msg = Message(
            subject='Order Confirmation',
            sender='berriossebas92@gmail.com',
            recipients=[email],
        )

        msg.body = f'Gracias por tu compra! Tu orden con ID {order_id} ha sido confirmada. Pronto recibirás más detalles sobre el envío.'
        mail.send(msg)
        return jsonify({ 'message': 'order confirmation email sent' }), 200
    
    except Exception as e:
        print(f'error sending order confirmation email: {e}')
        return jsonify({ 'error': 'sending order confirmation email failed' }), 500