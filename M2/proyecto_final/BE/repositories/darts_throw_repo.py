from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import darts_throws_table

class DartThrowRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, game_id, part_id, dart_type, visible_to_dm, visible_to_players, throw_value):
        try:
            stmt = insert(darts_throws_table).returning(darts_throws_table.c.id).values({
                "game_id": game_id,
                "part_id": part_id,
                "dart_type": dart_type,
                "visible_to_dm": visible_to_dm,
                "visible_to_players": visible_to_players,
                "throw_value": throw_value
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating dart throw: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(darts_throws_table)
            query = self.query_manager.execute_get(stmt)
            characters = query.mappings().all()
            return characters or None
        except Exception as e:
            print(f"Error reading darts_throws: {e}")
            return None
    
    def read_by_id(self, dt_id):
        try:
            stmt = select(darts_throws_table).where(darts_throws_table.c.id == dt_id)
            query = self.query_manager.execute_get(stmt)
            character = query.mappings().first()
            return character or None
        except Exception as e:
            print(f"Error reading dart throw by ID: {e}")
            return None
        
    def read_by_part_id(self, part_id):
        try:
            stmt = select(darts_throws_table).where(darts_throws_table.c.part_id == part_id)
            query = self.query_manager.execute_get(stmt)
            throws = query.mappings().all()
            return throws or None
        except Exception as e:
            print(f"Error reading dart throws by participant ID: {e}")
            return None
        
    def read_by_game_id(self, game_id):
        try:
            stmt = select(darts_throws_table).where(darts_throws_table.c.game_id == game_id)
            query = self.query_manager.execute_get(stmt)
            throws = query.mappings().all()
            return throws or None
        except Exception as e:
            print(f"Error reading dart throws by game ID: {e}")
            return None
        
    def update(self, dt_id, **kwargs):
        try:
            stmt = update(darts_throws_table).where(darts_throws_table.c.id == dt_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Dart Throw", dt_id)
            return query
        except Exception as e:
            print(f"Error updating dart throw: {e}")
            return False
    
    def delete(self, dt_id):
        try:
            stmt = delete(darts_throws_table).where(darts_throws_table.c.id == dt_id)
            query = self.query_manager.execute_delete(stmt, "Dart Throw", dt_id)
            return query
        except Exception as e:
            print(f"Error deleting dart throw: {e}")
            return False