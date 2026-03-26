from sqlalchemy import insert, select, update, delete
from db.db import DBManager
from db.db import products

class ProductsRepository:
    def __init__(self):
        self.db_manager = DBManager()

    def create(self, name, description, price, category, stock, image_url=None):
        try:
            stmt = insert(products).returning(products).values({
                "name": name,
                "description": description,
                "price": price,
                "category": category,
                "stock": stock,
                "image_url": image_url
            })
        
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.mappings().fetchone()
        
        except Exception as e:
            print(f"Error creating product: {e}")
            return None
    
    def read_all(self):
        try:
            stmt = select(products)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                all_products = result.mappings().all()
                return all_products
        
        except Exception as e:
            print(f"Error reading products: {e}")
            return None
    
    def read_by_id(self, product_id):
        try:
            stmt = select(products).where(products.c.id == product_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                product = result.mappings().first()
                return product
        
        except Exception as e:
            print(f"Error reading product by ID: {e}")
            return None
    
    def update(self, product_id, update_data):
        try:
            stmt = update(products).where(products.c.id == product_id).values(update_data)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.rowcount
        
        except Exception as e:
            print(f"Error updating product: {e}")
            return None
    
    def delete(self, product_id):
        from db.db import cart_products
        try:
            with self.db_manager.engine.connect() as conn:
                # Elimina referencias en cart_products
                stmt_cart = delete(cart_products).where(cart_products.c.product_id == product_id)
                conn.execute(stmt_cart)
                # Ahora elimina el producto
                stmt_product = delete(products).where(products.c.id == product_id)
                result = conn.execute(stmt_product)
                conn.commit()
                return result.rowcount
        except Exception as e:
            print(f"Error deleting product: {e}")
            return None