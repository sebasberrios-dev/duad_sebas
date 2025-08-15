from sqlalchemy import insert, select, and_
from db.db import DBManager
from db.db import user_table

class UserRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create(self, username, password, role):
        try:
            stmt = insert(user_table).returning(user_table.c.id).values({
                "username": username, 
                "password": password,
                "role": role})
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.fetchone()
        except Exception as e:
            print(f"Error creando el usuario {e}")
            return None


    def read(self, username, password):
        stmt = select(user_table).where(
            user_table.c.username == username,
            user_table.c.password == password
        )
        with self.db_manager.engine.connect() as conn:
            result = conn.execute(stmt)
            users = result.mappings().all()
            return users or None


    def read_by_id(self, user_id):
        stmt = select(user_table).where(user_table.c.id == user_id)
        with self.db_manager.engine.connect() as conn:
            result = conn.execute(stmt)
            user = result.fetchone()
            return user or None
            
            
    
    