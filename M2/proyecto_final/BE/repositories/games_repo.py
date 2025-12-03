import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import games_table

class GamesRepository:
    def __init__(self):
        self.query_manager = QueryManager()

    def create(self, dm_id, title, description, link):
        try:
            stmt = insert(games_table).returning(games_table.c.id).values({
                "dm_id": dm_id,
                "title": title,
                "description": description,
                "link": link
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()

        except Exception as e:
            print(f"Error creating game: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(games_table)
            query = self.query_manager.execute_get(stmt)
            games = query.mappings().all()
            return games or None
        except Exception as e:
            print(f"Error reading games: {e}")
            return None
    
    def read_by_id(self, game_id):
        try:
            stmt = select(games_table).where(games_table.c.id == game_id)
            query = self.query_manager.execute_get(stmt)
            game = query.mappings().first()
            return game or None
        except Exception as e:
            print(f"Error reading game by ID: {e}")
            return None
    
    def read_by_dm_id(self, dm_id):
        try:
            stmt = select(games_table).where(games_table.c.dm_id == dm_id)
            query = self.query_manager.execute_get(stmt)
            games = query.mappings().all()
            return games or None
        except Exception as e:
            print(f"Error reading games by DM ID: {e}")
            return None
    
    def read_by_link(self, link):
        try:
            stmt = select(games_table).where(games_table.c.link == link)
            query = self.query_manager.execute_get(stmt)
            game = query.mappings().first()
            return game or None
        except Exception as e:
            print(f"Error reading game by link: {e}")
            return None
    
    def update(self, game_id, **kwargs):
        try:
            stmt = update(games_table).where(games_table.c.id == game_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Game", game_id)
            return query
        except Exception as e:
            print(f"Error updating game: {e}")
            return False
    
    def delete(self, game_id):
        try:
            stmt = delete(games_table).where(games_table.c.id == game_id)
            query = self.query_manager.execute_delete(stmt, "Game", game_id)
            return query
        except Exception as e:
            print(f"Error deleting game: {e}")
            return False