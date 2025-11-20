from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import chat_messages_table

class ChatRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, game_id, user_id, message):
        try:
            stmt = insert(chat_messages_table).returning(chat_messages_table.c.id).values({
                "game_id": game_id,
                "user_id": user_id,
                "message": message
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating message: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(chat_messages_table)
            query = self.query_manager.execute_get(stmt)
            characters = query.mappings().all()
            return characters or None
        except Exception as e:
            print(f"Error reading chat messages: {e}")
            return None
    
    def read_by_id(self, cm_id):
        try:
            stmt = select(chat_messages_table).where(chat_messages_table.c.id == cm_id)
            query = self.query_manager.execute_get(stmt)
            character = query.mappings().first()
            return character or None
        except Exception as e:
            print(f"Error reading chat message by ID: {e}")
            return None
        
    def update(self, cm_id, **kwargs):
        try:
            stmt = update(chat_messages_table).where(chat_messages_table.c.id == cm_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Chat Message", cm_id)
            return query
        except Exception as e:
            print(f"Error updating chat message: {e}")
            return False
    
    def delete(self, cm_id):
        try:
            stmt = delete(chat_messages_table).where(chat_messages_table.c.id == cm_id)
            query = self.query_manager.execute_delete(stmt, "Chat Message", cm_id)
            return query
        except Exception as e:
            print(f"Error deleting chat message: {e}")
            return False