import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, delete, update
from BE.utils.query_manager import QueryManager
from BE.database import characters_table

class CharactersRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, user_id, name, race, char_class, level, attributes, story):
        try:
            stmt = insert(characters_table).returning(characters_table.c.id).values({
                "user_id": user_id,
                "name": name,
                "race": race,
                "class": char_class,
                "level": level,
                "attributes": attributes,
                "story": story
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating character: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(characters_table)
            query = self.query_manager.execute_get(stmt)
            characters = query.mappings().all()
            return characters or None
        except Exception as e:
            print(f"Error reading characters: {e}")
            return None
    
    def read_by_id(self, character_id):
        try:
            stmt = select(characters_table).where(characters_table.c.id == character_id)
            query = self.query_manager.execute_get(stmt)
            character = query.mappings().first()
            return character or None
        except Exception as e:
            print(f"Error reading character by ID: {e}")
            return None
    
    def read_by_user_id(self, user_id):
        try:
            stmt = select(characters_table).where(characters_table.c.user_id == user_id)
            query = self.query_manager.execute_get(stmt)
            characters = query.mappings().all()
            return characters or None
        except Exception as e:
            print(f"Error reading characters by user ID: {e}")
            return None
        
    def update(self, character_id, **kwargs):
        try:
            stmt = update(characters_table).where(characters_table.c.id == character_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Character", character_id)
            return query
        except Exception as e:
            print(f"Error updating character: {e}")
            return False
    
    def delete(self, character_id):
        try:
            stmt = delete(characters_table).where(characters_table.c.id == character_id)
            query = self.query_manager.execute_delete(stmt, "Character", character_id)
            return query
        except Exception as e:
            print(f"Error deleting character: {e}")
            return False