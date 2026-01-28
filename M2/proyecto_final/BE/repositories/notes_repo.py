import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import notes_table, users_table

class NotesRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, user_id, game_id, content, visible_for_players, visible_for_dm):
        try:
            stmt = insert(notes_table).returning(notes_table.c.id).values({
                "user_id": user_id,
                "game_id": game_id,
                "visible_for_players": visible_for_players,
                "visible_for_dm": visible_for_dm,
                "content": content
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating note: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(notes_table)
            query = self.query_manager.execute_get(stmt)
            notes = query.mappings().all()
            return notes or None
        except Exception as e:
            print(f"Error reading notes: {e}")
            return None
    
    def read_by_id(self, note_id):
        try:
            stmt = select(notes_table).where(notes_table.c.id == note_id)
            query = self.query_manager.execute_get(stmt)
            note = query.mappings().first()
            return note or None
        except Exception as e:
            print(f"Error reading note by ID: {e}")
            return None
    
    def read_by_game_id(self, game_id):
        try:
            stmt = select(notes_table).where(notes_table.c.game_id == game_id)
            query = self.query_manager.execute_get(stmt)
            notes = query.mappings().all()
            return notes or []
        except Exception as e:
            print(f"Error reading notes by game ID: {e}")
            return []
    
    def read_by_game_id_with_username(self, game_id):
        try:
            stmt = select(
                notes_table,
                users_table.c.username
            ).join(
                users_table,
                notes_table.c.user_id == users_table.c.id
            ).where(notes_table.c.game_id == game_id)
            
            query = self.query_manager.execute_get(stmt)
            notes = query.mappings().all()
            return notes or []
        except Exception as e:
            print(f"Error reading notes with username by game ID: {e}")
            return []
        
    def read_by_user_id(self, user_id):
        try:
            stmt = select(notes_table).where(notes_table.c.user_id == user_id)
            query = self.query_manager.execute_get(stmt)
            notes = query.mappings().all()
            return notes or None
        except Exception as e:
            print(f"Error reading notes by user ID: {e}")
            return None
    
    def update(self, note_id, **kwargs):
        try:
            stmt = update(notes_table).where(notes_table.c.id == note_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Note", note_id)
            return query
        except Exception as e:
            print(f"Error updating note: {e}")
            return False
        
    def delete(self, note_id):
        try:
            stmt = delete(notes_table).where(notes_table.c.id == note_id)
            query = self.query_manager.execute_delete(stmt, "Note", note_id)
            return query
        except Exception as e:
            print(f"Error deleting note: {e}")
            return False