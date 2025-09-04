from sqlalchemy import insert, select, delete
from db.db import DBManager
from db.db import user_table

class UserRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create(self, username, email, password, role):
        try:
            stmt = insert(user_table).returning(user_table.c.id).values({
                "username": username,
                "email": email,
                "password": password,
                "role": role
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                return result.fetchone()
        except Exception as e:
            print(f"Error creating user: {e}")
            return None


    def read(self, username, password):
        try:
            stmt = select(user_table).where(
                user_table.c.username == username,
                user_table.c.password == password
            )
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                users = result.mappings().all()
                return users or None
        except Exception as e:
            print(f"Error reading user: {e}")
            return None
    

    def read_by_id(self, user_id):
        try:
            stmt = select(user_table).where(user_table.c.id == user_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                user = result.mappings().first()
                return user or None
        except Exception as e:
            print(f"Error reading user by ID: {e}")
            return None
        
    
    def delete(self, user_id):
        try:
            stmt = delete(user_table).where(user_table.c.id == user_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                conn.commit()
                if result.rowcount > 0:
                    print(f"User {user_id} deleted successfully.")
                    return True
                else:
                    print(f"User with ID {user_id} not found.")
                    return False
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False

