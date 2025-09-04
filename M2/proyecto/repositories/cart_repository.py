from sqlalchemy import insert, select, update, delete
from db.db import DBManager
from db.db import cart_table, product_cart_table

class CartRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create(self, user_id, status):
        try:
            stmt = insert(cart_table).returning(cart_table.c.id).values({
                "user_id": user_id,
                "status": status
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.fetchone()
        except Exception as e:
            print(f"Error creating cart: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(cart_table)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                carts = result.mappings().all()
                return carts or None
        except Exception as e:
            print(f"Error reading carts: {e}")
            return None
    
    def read_by_id(self, cart_id):
        try:
            stmt = select(cart_table).where(cart_table.c.id == cart_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                cart = result.mappings().first()
                return cart or None
        except Exception as e:
            print(f"Error reading cart by ID: {e}")
            return None
    
    def read_by_user_id(self, user_id):
        try:
            stmt = select(cart_table).where(cart_table.c.user_id == user_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                carts = result.mappings().all()
                return carts or None
        except Exception as e:
            print(f"Error reading carts by user ID: {e}")
            return None
    
    def update(self, cart_id, updated_fields: dict):
        try:
            stmt = update(cart_table).where(cart_table.c.id == cart_id).values(**updated_fields)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error updating cart: {e}")
            return False

    def delete(self, cart_id):
        try:
            stmt = delete(cart_table).where(cart_table.c.id == cart_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error deleting cart: {e}")
            return False
    
    def add_product(self, cart_id, product_id, quantity):
        try:
            stmt = insert(product_cart_table).returning(product_cart_table.c.id).values({
                "cart_id": cart_id,
                "product_id": product_id,
                "quantity": quantity
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.fetchone()
        except Exception as e:
            print(f"Error adding product to cart: {e}")
            return None
    
    def remove_product(self, cart_id, product_id):
        try:
            stmt = delete(product_cart_table).where(
                product_cart_table.c.cart_id == cart_id,
                product_cart_table.c.product_id == product_id
            )
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error removing product from cart: {e}")
            return False
        
    def read_products_in_cart(self, cart_id):
        try:
            stmt = select(product_cart_table).where(
                product_cart_table.c.cart_id == cart_id
            )
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result.mappings().all()
        except Exception as e:
            print(f"Error reading products in cart: {e}")
            return None

    def read_product(self, cart_id, product_id):
        try:
            stmt = select(product_cart_table).where(
                product_cart_table.c.cart_id == cart_id,
                product_cart_table.c.product_id == product_id
            )
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.mappings().first()
        except Exception as e:
            print(f"Error reading product from cart: {e}")
            return None
    
    def update_product(self, cart_id, product_id, quantity):
        try:
            stmt = update(product_cart_table).where(
                product_cart_table.c.cart_id == cart_id,
                product_cart_table.c.product_id == product_id
            ).values(quantity=quantity)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error updating product in cart: {e}")
            return False