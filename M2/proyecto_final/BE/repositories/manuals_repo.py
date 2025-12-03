from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import manuals_table

class ManualsRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, title, content):
        try:
            stmt = insert(manuals_table).returning(manuals_table.c.id).values({
                "title": title,
                "content": content
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating manual: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(manuals_table)
            query = self.query_manager.execute_get(stmt)
            manuals = query.mappings().all()
            return manuals or None
        except Exception as e:
            print(f"Error reading manuals: {e}")
            return None
    
    def update(self, manual_id, **kwargs):
        try:
            stmt = update(manuals_table).where(manuals_table.c.id == manual_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Manual", manual_id)
            return query
        except Exception as e:
            print(f"Error updating manual: {e}")
            return False
    
    def delete(self, manual_id):
        try:
            stmt = delete(manuals_table).where(manuals_table.c.id == manual_id)
            query = self.query_manager.execute_delete(stmt, "Manual", manual_id)
            return query
        except Exception as e:
            print(f"Error deleting manual: {e}")
            return False
    
    