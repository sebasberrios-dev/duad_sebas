import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, update
from BE.utils.query_manager import QueryManager
from BE.database import combat_state_table

class CombatRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create_combat(self, game_id, npc_id, npc_current_hp, npc_max_hp, max_rolls):
        try:
            # Primero terminar cualquier combate activo en este juego
            self.end_active_combats(game_id)
            
            stmt = insert(combat_state_table).returning(combat_state_table.c.id).values({
                "game_id": game_id,
                "npc_id": npc_id,
                "npc_current_hp": npc_current_hp,
                "npc_max_hp": npc_max_hp,
                "max_rolls": max_rolls,
                "current_rolls": 0,
                "is_active": True
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating combat: {e}")
            return None
    
    def get_active_combat(self, game_id):
        try:
            stmt = select(combat_state_table).where(
                combat_state_table.c.game_id == game_id,
                combat_state_table.c.is_active == True
            )
            query = self.query_manager.execute_get(stmt)
            combat = query.mappings().first()
            return combat or None
        except Exception as e:
            print(f"Error getting active combat: {e}")
            return None
    
    def register_attack(self, combat_id, damage_dealt):
        try:
            stmt = select(combat_state_table).where(combat_state_table.c.id == combat_id)
            query = self.query_manager.execute_get(stmt)
            combat = query.mappings().first()
            
            if not combat:
                return None
            
            new_hp = max(0, combat['npc_current_hp'] - damage_dealt)
            new_rolls = combat['current_rolls'] + 1
            
            update_stmt = update(combat_state_table).where(
                combat_state_table.c.id == combat_id
            ).values({
                "npc_current_hp": new_hp,
                "current_rolls": new_rolls
            }).returning(combat_state_table)
            
            result = self.query_manager.execute_post(update_stmt)
            updated_combat = result.mappings().first()
            return updated_combat
        except Exception as e:
            print(f"Error registering attack: {e}")
            return None
    
    def end_combat(self, combat_id):
        try:
            stmt = update(combat_state_table).where(
                combat_state_table.c.id == combat_id
            ).values({
                "is_active": False
            })
            self.query_manager.execute_post(stmt)
            return True
        except Exception as e:
            print(f"Error ending combat: {e}")
            return False
    
    def end_active_combats(self, game_id):
        try:
            stmt = update(combat_state_table).where(
                combat_state_table.c.game_id == game_id,
                combat_state_table.c.is_active == True
            ).values({
                "is_active": False
            })
            self.query_manager.execute_post(stmt)
            return True
        except Exception as e:
            print(f"Error ending active combats: {e}")
            return False
