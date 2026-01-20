import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, delete, update
from BE.utils.query_manager import QueryManager
from BE.database import participants_table

class ParticipantsRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, game_id, user_id, character_id):
        try:
            stmt = insert(participants_table).returning(participants_table.c.id).values({
                "game_id": game_id,
                "user_id": user_id,
                "character_id": character_id,
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating participant: {e}")
            return None
        
    def create_owner_participation(self, user_id, game_id):
        try:
            stmt = insert(participants_table).returning(participants_table.c.id).values({
                "game_id": game_id,
                "user_id": user_id,
                "character_id": None,
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        
        except Exception as e:
            print(f"Error creating owner participation: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(participants_table)
            query = self.query_manager.execute_get(stmt)
            participants = query.mappings().all()
            return participants or None
        except Exception as e:
            print(f"Error reading participants: {e}")
            return None
    
    def read_by_id(self, part_id):
        try:
            stmt = select(participants_table).where(participants_table.c.id == part_id)
            query = self.query_manager.execute_get(stmt)
            participant = query.mappings().first()
            return participant or None
        except Exception as e:
            print(f"Error reading participant by ID: {e}")

    def read_by_user_id(self, user_id):
        try:
            stmt = select(participants_table).where(participants_table.c.user_id == user_id)
            query = self.query_manager.execute_get(stmt)
            participants = query.mappings().all()
            return participants or None
        except Exception as e:
            print(f"Error reading participants by user ID: {e}")
            return None
    
    def read_by_game_id(self, game_id):
        try:
            stmt = select(participants_table).where(participants_table.c.game_id == game_id)
            query = self.query_manager.execute_get(stmt)
            participants = query.mappings().all()
            return participants or []
        except Exception as e:
            print(f"Error reading participants by game ID: {e}")
            return []
    
    def read_by_user_and_game(self, user_id, game_id):
        # Para verificar si un usuario participa en una partida específica"""
        try:
            stmt = select(participants_table).where(
                (participants_table.c.user_id == user_id) & 
                (participants_table.c.game_id == game_id)
            )
            query = self.query_manager.execute_get(stmt)
            participant = query.mappings().first()
            return participant or None
        except Exception as e:
            print(f"Error reading participant by user and game: {e}")
            return None
    
    def update(self, part_id, **kwargs):
        try:
            stmt = update(participants_table).where(participants_table.c.id == part_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Participant", part_id)
            return query
        except Exception as e:
            print(f"Error updating participant: {e}")
            return False
    
    def delete(self, part_id):
        try:
            stmt = delete(participants_table).where(participants_table.c.id == part_id)
            query = self.query_manager.execute_delete(stmt, "Participant", part_id)
            return query
        except Exception as e:
            print(f"Error deleting participant: {e}")
            return False