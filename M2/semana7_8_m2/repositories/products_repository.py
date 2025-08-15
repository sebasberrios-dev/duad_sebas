from sqlalchemy import insert, select, update
from db.db import DBManager
from db.db import product_table

class ProductRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create(self, name, price, entry_date, quantity):
        try:
            stmt = insert(product_table).returning(product_table.c.id).values({
                "name": name,
                "price": price,
                "entry_date": entry_date,
                "quantity": quantity
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.fetchone()   
        except Exception as e:
            print(f"Error creando el producto {e}")
            return None


    def read(self):
        stmt = select(product_table)
        with self.db_manager.engine.connect() as conn:
            result = conn.execute(stmt)
            products = result.mappings().all()          
            return products or None
        

    def read_by_id(self, product_id):
        stmt = select(product_table).where(product_table.c.id == product_id)
        with self.db_manager.engine.connect() as conn:
            result = conn.execute(stmt)
            row = result.mappings().first()
            return row or None
