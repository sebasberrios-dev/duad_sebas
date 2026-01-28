import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import npcs_table

class NPCRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, game_id, name, role, level, description, attributes, hp):
        try:
            stmt = insert(npcs_table).returning(npcs_table.c.id).values({
                "game_id": game_id,
                "name": name,
                "role": role,
                "level": level,
                "description": description,
                "hp": hp,
                "attributes": attributes
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating npc: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(npcs_table)
            query = self.query_manager.execute_get(stmt)
            npcs = query.mappings().all()
            return npcs or None
        except Exception as e:
            print(f"Error reading npcs: {e}")
            return None
    
    def read_by_id(self, npc_id):
        try:
            stmt = select(npcs_table).where(npcs_table.c.id == npc_id)
            query = self.query_manager.execute_get(stmt)
            npc = query.mappings().first()
            return npc or None
        except Exception as e:
            print(f"Error reading npc by ID: {e}")
            return None
    
    def read_by_game_id(self, game_id):
        try:
            stmt = select(npcs_table).where(npcs_table.c.game_id == game_id)
            query = self.query_manager.execute_get(stmt)
            npcs = query.mappings().all()
            return npcs or []
        except Exception as e:
            print(f"Error reading NPCs by game ID: {e}")
            return []
        
    def update(self, npc_id, **kwargs):
        try:
            stmt = update(npcs_table).where(npcs_table.c.id == npc_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "NPC", npc_id)
            return query
        except Exception as e:
            print(f"Error updating npc: {e}")
            return False
    
    def delete(self, npc_id):
        try:
            stmt = delete(npcs_table).where(npcs_table.c.id == npc_id)
            query = self.query_manager.execute_delete(stmt, "NPC", npc_id)
            return query
        except Exception as e:
            print(f"Error deleting npc: {e}")
            return False
        

