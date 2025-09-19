from sqlalchemy import select, insert, update, delete
from db.db import DBManager
from db.db import product_table

class ProductRepository:
    def __init__(self):
        self.db_manager = DBManager()

    def create(self, name, price, stock, entry_date):
        try:
            stmt = insert(product_table).returning(product_table.c.id).values({
                "name": name,
                "price": price,
                "stock": stock,
                "entry_date": entry_date
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.fetchone()
        except Exception as e:
            print(f"Error creating product: {e}")
            return None
    

    def read(self):
        try:
            stmt = select(product_table)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                products = result.mappings().all()
                return products or None
        except Exception as e:
            print(f"Error reading products: {e}")
            return None
    

    def read_by_id(self, product_id):
        try:
            stmt = select(product_table).where(product_table.c.id == product_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                product = result.mappings().first()
                return product or None
        except Exception as e:
            print(f"Error reading product by ID: {e}")
            return None
    

    def update(self, product_id, updated_fields: dict):
        try:
            stmt = update(product_table).where(product_table.c.id == product_id).values(**updated_fields)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error updating product: {e}")
            return False
    
    def delete(self, product_id):
        try:
            stmt = delete(product_table).where(product_table.c.id == product_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error deleting product: {e}")
            return False
        