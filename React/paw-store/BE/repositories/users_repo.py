from sqlalchemy import insert, select
import bcrypt
from db.db import DBManager
from db.db import users_table

class UserRepository:
    def __init__(self):
        self.db_manager = DBManager()
    
    def create(self, full_name, email, password, role="client"):
        try:
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            stmt = insert(users_table).returning(users_table.c.id).values({
                "full_name": full_name,
                "email": email,
                "password": password_hash,
                "role": role
            })
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                row = result.fetchone()
                conn.commit()
                return row
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    def read_by_email(self, email):
        try:
            stmt = select(users_table).where(users_table.c.email == email)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                user = result.mappings().first()
                return user
        except Exception as e:
            print(f"Error reading user: {e}")
            return None
        
    def read_by_id(self, user_id):
        try:
            stmt = select(users_table).where(users_table.c.id == user_id)
            with self.db_manager.engine.connect() as conn:
                result = conn.execute(stmt)
                user = result.mappings().first()
                return user
        except Exception as e:
            print(f"Error reading user by ID: {e}")
            return None