import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import coins_table

class CoinsRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, character_id, game_id, amount=0):
        try:
            stmt = insert(coins_table).returning(coins_table).values({
                "character_id": character_id,
                "game_id": game_id,
                "amount": amount
            })
            query = self.query_manager.execute_post(stmt)
            return query.mappings().first()
        
        except Exception as e:
            print(f"Error creating coins record: {e}")
            return None
    
    def read_by_character_and_game(self, character_id, game_id):
        try:
            stmt = select(coins_table).where(
                coins_table.c.character_id == character_id,
                coins_table.c.game_id == game_id
            )
            query = self.query_manager.execute_get(stmt)
            coins_record = query.mappings().first()
            return coins_record or None
        
        except Exception as e:
            print(f"Error reading coins by character and game: {e}")
            return None
    
    def update_amount(self, coins_record_id, amount):
        try:
            stmt = update(coins_table).where(
                coins_table.c.id == coins_record_id
            ).values({
                "amount": amount
            }).returning(coins_table)
            query = self.query_manager.execute_update(stmt, "Coins record", coins_record_id)
            return query.mappings().first()
        
        except Exception as e:
            print(f"Error updating coins amount: {e}")
            return None
        
    def delete(self, coins_record_id):
        try: 
            stmt = delete(coins_table).where(
                coins_table.c.id == coins_record_id
            )
            query = self.query_manager.execute_delete(stmt, "Coins record", coins_record_id)
            return query.rowcount > 0
        
        except Exception as e:
            print(f"Error deleting coins record: {e}")
            return False