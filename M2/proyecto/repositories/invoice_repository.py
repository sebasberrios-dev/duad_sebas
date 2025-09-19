from sqlalchemy import insert, select, update, delete
from db.db import DBManager
from db.db import invoice_table

class InvoiceRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create(self, cart_id, address, payment_details, issue_date, total):
        try:
            stmt = insert(invoice_table).returning(invoice_table.c.id).values({
                "cart_id": cart_id,
                "address": address,
                "payment_details": payment_details,
                "issue_date": issue_date,
                "total": total
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.fetchone()
        except Exception as e:
            print(f"Error creating invoice: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(invoice_table)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                invoices = result.mappings().all()
                return invoices or None
        except Exception as e:
            print(f"Error reading invoices: {e}")
            return None
    
    def read_by_id(self, invoice_id):
        try:
            stmt = select(invoice_table).where(invoice_table.c.id == invoice_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                invoice = result.mappings().first()
                return invoice or None
        except Exception as e:
            print(f"Error reading invoice by ID: {e}")
            return None
    
    def update(self, invoice_id, updated_fields: dict):
        try:
            stmt = update(invoice_table).where(invoice_table.c.id == invoice_id).values(**updated_fields)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error updating invoice: {e}")
            return False

    def delete(self, invoice_id):
        try:
            stmt = delete(invoice_table).where(invoice_table.c.id == invoice_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    return True
                else:
                    return False
        except Exception as e:
            print(f"Error deleting invoice: {e}")
            return False