import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, delete, update
from BE.utils.query_manager import QueryManager
from BE.database import users_table

class UsersRepository:
    def __init__(self):
        self.query_manager = QueryManager()

    def create(self, username, email, password, role):
        try:
            stmt = insert(users_table).returning(users_table.c.id).values({
                "username": username,
                "email": email,
                "password": password,
                "role": role
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    def read_all(self):
        try:
            stmt = select(users_table)
            query = self.query_manager.execute_get(stmt)
            users = query.mappings().all()
            return users
        except Exception as e:
            print(f"Error reading users: {e}")
            return None
        
    def read(self, username, password):
        try:
            stmt = select(users_table).where(
                users_table.c.username == username,
                users_table.c.password == password
            )
            query = self.query_manager.execute_get(stmt)
            user = query.mappings().first()
            return user or None
        except Exception as e:
            print(f"Error reading user: {e}")
            return None
    
    def read_by_id(self, user_id):
        try:
            stmt = select(users_table).where(users_table.c.id == user_id)
            query = self.query_manager.execute_get(stmt)
            user = query.mappings().first()
            return user or None
        except Exception as e:
            print(f"Error reading user by ID: {e}")
            return None
    
    def delete(self, user_id):
        try:
            stmt = delete(users_table).where(users_table.c.id == user_id)
            query = self.query_manager.execute_delete(stmt, "User", user_id)
            return query
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False
    
    def update(self, user_id, **kwargs):
        try:
            stmt = update(users_table).where(users_table.c.id == user_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "User", user_id)
            return query
        except Exception as e:
            print(f"Error updating user: {e}")
            return False