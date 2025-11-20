from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import npcs_table

class NPCRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, game_id, name, description, attributes):
        try:
            stmt = insert(npcs_table).returning(npcs_table.c.id).values({
                "game_id": game_id,
                "part_id": name,
                "description": description,
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
            characters = query.mappings().all()
            return characters or None
        except Exception as e:
            print(f"Error reading npcs: {e}")
            return None
    
    def read_by_id(self, npc_id):
        try:
            stmt = select(npcs_table).where(npcs_table.c.id == npc_id)
            query = self.query_manager.execute_get(stmt)
            character = query.mappings().first()
            return character or None
        except Exception as e:
            print(f"Error reading npc by ID: {e}")
            return None
        
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
        

