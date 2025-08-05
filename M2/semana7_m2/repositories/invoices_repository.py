from sqlalchemy import insert, select
from db.db import DBManager
from db.db import invoice_table 

class InvoiceRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create(self, user_id, product_id, total, date_created):
        try:
            stmt = insert(invoice_table).returning(*invoice_table.c).values({
                "user_id": user_id,
                "product_id": product_id,
                "total": total,
                "date_created": date_created
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                row = result.mappings().first()
                return row if row else None
        except Exception as e:
            print(f"Error creando la factura {e}")
            return None

    
    def read(self):
        stmt = select(invoice_table)
        with self.db_manager.engine.connect() as conn:
            result = conn.execute(stmt)
            invoices = result.mappings().all()
            return invoices if invoices else None
            
    def read_by_user_id(self, user_id):
        stmt = select(invoice_table).where(invoice_table.c.user_id == user_id)
        with self.db_manager.engine.connect() as conn:
            result = conn.execute(stmt)
            invoice = result.mappings().all()
            return invoice if invoice else None