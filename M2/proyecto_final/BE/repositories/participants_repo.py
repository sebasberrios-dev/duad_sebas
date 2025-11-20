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
                "character_id": character_id
            })
            query = self.query_manager.execute_post(stmt)
            return query
        except Exception as e:
            print(f"Error creating participant: {e}")
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
        
participants_repo = ParticipantsRepository()

#participants_repo.create(2, 2, 3)

#read = participants_repo.read()
#print(read)

#read_by_id = participants_repo.read_by_id(1)
#print(read_by_id)

#participants_repo.update(1, character_id=4)