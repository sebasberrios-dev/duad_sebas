from sqlalchemy import insert, select, update, delete, func
from db.db import DBManager
from db.db import shopping_cart, cart_products, orders, order_products, billing_info, order_info, products
from repositories.products_repo import ProductsRepository

class PurchaseFlowRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create_cart(self, user_id):
        try:
            stmt = insert(shopping_cart).returning(shopping_cart).values({
                "user_id": user_id,   
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.mappings().fetchone()
        except Exception as e:
            print(f'error creating cart: {e}')
            return None
        
    def get_cart(self, user_id):
        try:
            stmt = select(shopping_cart).where(shopping_cart.c.user_id == user_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result.mappings().fetchone()
        except Exception as e:
            print(f'error getting cart: {e}')
            return None 
    
    def add_product_to_cart(self, cart_id, product_id, quantity):
        try:
            # Verificar si ya existe el producto en el carrito
            stmt_check = select(cart_products).where(
                cart_products.c.cart_id == cart_id,
                cart_products.c.product_id == product_id
            )
            with self.db_manager.engine.connect() as conn:
                result_check = conn.execute(stmt_check)
                existing = result_check.mappings().fetchone()
                if existing:
                    # Si existe, actualizar la cantidad (puedes elegir sumar o reemplazar)
                    new_quantity = quantity  # O: existing["quantity"] + quantity
                    stmt_update = update(cart_products).where(
                        cart_products.c.cart_id == cart_id,
                        cart_products.c.product_id == product_id
                    ).values({"quantity": new_quantity}).returning(cart_products)
                    result = conn.execute(stmt_update)
                    conn.commit()
                    return result.mappings().fetchone()
                else:
                    # Si no existe, insertar
                    stmt_insert = insert(cart_products).values({
                        "cart_id": cart_id,
                        "product_id": product_id,
                        "quantity": quantity,
                    }).returning(cart_products)
                    result = conn.execute(stmt_insert)
                    conn.commit()
                    return result.mappings().fetchone()
        except Exception as e:
            print(f'error adding product to cart: {e}')
            return None

    def remove_product_from_cart(self, cart_id, product_id):
        try:
            stmt = delete(cart_products).where(
                cart_products.c.cart_id == cart_id,
                cart_products.c.product_id == product_id
            )
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.rowcount
        except Exception as e:
            print(f'error removing product from cart: {e}')
            return None
    
    def update_product_quantity_in_cart(self, cart_id, product_id, new_quantity):
        try:
            stmt = update(cart_products).where(
                cart_products.c.cart_id == cart_id,
                cart_products.c.product_id == product_id
            ).values({
                "quantity": new_quantity
            }).returning(cart_products)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.mappings().fetchone()
        except Exception as e:
            print(f'error updating product quantity in cart: {e}')
            return None
    
    def get_product_in_cart(self, cart_id, product_id):
        try:
            stmt = select(cart_products).where(
                cart_products.c.cart_id == cart_id,
                cart_products.c.product_id == product_id
            )
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result.mappings().fetchone()
        except Exception as e:
            print(f'error checking product in cart: {e}')
            return None


    def get_products_in_cart(self, cart_id):
        try:
            stmt = (select(products.c.id, products.c.name, products.c.image_url,  products.c.price, cart_products.c.quantity)
                    .join(cart_products, products.c.id == cart_products.c.product_id)
                    .where(cart_products.c.cart_id == cart_id))
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result.mappings().fetchall()
        except Exception as e:
            print(f'error getting products in cart: {e}')
            return None

    def create_order(self, cart_id, total_price, products):
        try:
            products_repo = ProductsRepository()
            with self.db_manager.engine.begin() as conn:
                # Filtrar productos eliminados o sin stock
                valid_products = []
                for product in products:
                    db_product = products_repo.read_by_id(product["product_id"])
                    if db_product and db_product.get("stock", 0) >= product["quantity"]:
                        valid_products.append(product)

                if not valid_products:
                    raise Exception("No hay productos válidos para crear la orden (eliminados o sin stock)")

                # Crear orden
                order_stmt = insert(orders).returning(orders).values({
                    "cart_id": cart_id,
                    "total_price": total_price,
                    "status": "pending",
                })
                order_result = conn.execute(order_stmt)
                order = order_result.mappings().fetchone()

                # Agregar productos a la orden
                for product in valid_products:
                    order_product_stmt = insert(order_products).values({
                        "order_id": order["id"],
                        "product_id": product["product_id"],
                        "quantity": product["quantity"],
                        "price_at_purchase": product["price"],
                    })
                    conn.execute(order_product_stmt)
                conn.commit()
                return order
        except Exception as e:
            print(f'error creating order: {e}')
            return None 
        
    def get_order(self, order_id):
        try:
            stmt = select(orders).where(orders.c.id == order_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result.mappings().fetchone()
        except Exception as e:
            print(f'error getting order: {e}')
            return None
        
    def create_billing_info(self, order_id, user_id, full_name, email, shipping_address, phone_number):
        try:
            with self.db_manager.engine.begin() as conn:
                # Crear información del usuario
                billing_info_stmt = insert(billing_info).returning(billing_info).values({
                    "user_id": user_id,
                    "full_name": full_name,
                    "email": email,
                    "shipping_address": shipping_address,
                    "phone_number": phone_number,
                })
                billing_info_result = conn.execute(billing_info_stmt)
                info = billing_info_result.mappings().fetchone()

                # Crear relación entre orden e información del usuario
                order_info_stmt = insert(order_info).values({
                    "order_id": order_id,
                    "billing_info_id": info["id"],
                })
                conn.execute(order_info_stmt)
                conn.commit()

                return info
            
        except Exception as e:
            print(f'error creating billing info (repo): {e}')
            return None
    
    def get_order_info(self, order_id):
        try:
            stmt = (select(billing_info)
                    .join(order_info, billing_info.c.id == order_info.c.billing_info_id)
                    .where(order_info.c.order_id == order_id))
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result.mappings().fetchone()
        except Exception as e:
            print(f'error getting order info: {e}')
            return None
    
    def update_order_status(self, order_id, new_status):
        try:
            stmt = update(orders).where(orders.c.id == order_id).values({
                "status": new_status
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.rowcount
        except Exception as e:
            print(f'error updating order status: {e}')
            return None
    
    def clear_cart(self, cart_id):
        try:
            stmt = delete(cart_products).where(cart_products.c.cart_id == cart_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.rowcount
        except Exception as e:
            print(f'error clearing cart: {e}')
            return None 
    
        
    def get_most_purchased_products(self, limit=5):
        try:
            stmt = (select(products.c.id, products.c.name, products.c.image_url, products.c.price, products.c.stock, func.sum(order_products.c.quantity).label("total_quantity"))
                    .join(order_products, products.c.id == order_products.c.product_id)
                    .group_by(products.c.id)
                    .order_by(func.sum(order_products.c.quantity).desc())
                    .limit(limit))
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result.mappings().fetchall()
        
        except Exception as e:
            print(f'error getting most purchased products: {e}')
            return None