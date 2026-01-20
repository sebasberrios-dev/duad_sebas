from ..database import DBManager

class QueryManager:
    def __init__(self):
        self.db_manager = DBManager()
    
    def execute_post(self, stmt):
        try:
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result
        except Exception as e:
            raise e
    
    def execute_get(self, stmt):
        try:
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                return result
        except Exception as e:
            raise e
    
    def execute_update(self, stmt, operation_name, entity_id):
        try:
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    print(f"{operation_name} {entity_id} updated successfully.")
                    return True
                else:
                    print(f"{operation_name} {entity_id} not found.")
                    return False
        except Exception as e:
            raise e
        
    def execute_delete(self, stmt, operation_name, entity_id):
        try:
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    print(f"{operation_name} {entity_id} deleted successfully.")
                    return True
                else:
                    print(f"{operation_name} {entity_id} not found.")
                    return False
        except Exception as e:
            raise e