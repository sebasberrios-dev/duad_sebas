import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import insert, select, update, delete
from BE.utils.query_manager import QueryManager
from BE.database import inventories_table, items_table, inventory_items_table

class InventoryRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, character_id):
        try:
            stmt = insert(inventories_table).returning(inventories_table.c.id).values({
                "character_id": character_id
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        except Exception as e:
            print(f"Error creating inventory: {e}")
            return None
    
    def read(self):
        try:
            stmt = select(inventories_table)
            query = self.query_manager.execute_get(stmt)
            inventories = query.mappings().all()
            return inventories or None
        except Exception as e:
            print(f"Error reading inventories: {e}")
            return None
        
    def read_by_character_id(self, character_id):
        try:
            stmt = select(inventories_table).where(inventories_table.c.character_id == character_id)
            query = self.query_manager.execute_get(stmt)
            inventory = query.mappings().first()
            return inventory or None
        except Exception as e:
            print(f"Error reading inventory by character ID: {e}")
            return None
    
    def get_inventory_with_items(self, character_id):
        """Obtiene el inventario completo con todos los items del personaje"""
        try:
            # JOIN entre inventories, inventory_items e items
            stmt = select(
                inventories_table.c.id.label('inventory_id'),
                inventories_table.c.character_id,
                items_table.c.id.label('item_id'),
                items_table.c.name,
                items_table.c.description,
                items_table.c.type,
                items_table.c.attributes,
                items_table.c.rarity,
                inventory_items_table.c.quantity
            ).select_from(
                inventories_table.join(
                    inventory_items_table,
                    inventories_table.c.id == inventory_items_table.c.inventory_id
                ).join(
                    items_table,
                    inventory_items_table.c.item_id == items_table.c.id
                )
            ).where(inventories_table.c.character_id == character_id)
            
            query = self.query_manager.execute_get(stmt)
            items = query.mappings().all()
            return items or []
        except Exception as e:
            print(f"Error getting inventory with items: {e}")
            return []
    
    def update(self, inventory_id, **kwargs):
        try:
            stmt = update(inventories_table).where(inventories_table.c.id == inventory_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Inventory", inventory_id)
            return query
        except Exception as e:
            print(f"Error updating inventory: {e}")
            return False
    
    def delete(self, inventory_id):
        try:
            stmt = delete(inventories_table).where(inventories_table.c.id == inventory_id)
            query = self.query_manager.execute_delete(stmt, "Inventory", inventory_id)
            return query
        except Exception as e:
            print(f"Error deleting inventory: {e}")
            return False
        
class ItemRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, name, description, item_type, attributes, rarity):
        try:
            stmt = insert(items_table).returning(items_table.c.id).values({
                "name": name,
                "description": description,
                "type": item_type,
                "attributes": attributes,
                "rarity": rarity
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        
        except Exception as e:
            print(f"Error creating item: {e}")
            return None
    
    def read_by_id(self, item_id):
        try:
            stmt = select(items_table).where(items_table.c.id == item_id)
            query = self.query_manager.execute_get(stmt)
            item = query.mappings().first()
            return item or None
        except Exception as e:
            print(f"Error reading item by ID: {e}")
            return None
        
    def read(self):
        try:
            stmt = select(items_table)
            query = self.query_manager.execute_get(stmt)
            items = query.mappings().all()
            return items or None
        except Exception as e:
            print(f"Error reading items: {e}")
            return None
    
    def update(self, item_id, **kwargs):
        try:
            stmt = update(items_table).where(items_table.c.id == item_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "Item", item_id)
            return query
        except Exception as e:
            print(f"Error updating item: {e}")
            return False
    
    def delete(self, item_id):
        try:
            stmt = delete(items_table).where(items_table.c.id == item_id)
            query = self.query_manager.execute_delete(stmt, "Item", item_id)
            return query
        except Exception as e:
            print(f"Error deleting item: {e}")
            return False
    
class ItemInventoryRepository:
    def __init__(self):
        self.query_manager = QueryManager()
    
    def create(self, inventory_id, item_id, quantity):
        try:
            stmt = insert(inventory_items_table).returning(inventory_items_table.c.id).values({
                "inventory_id": inventory_id,
                "item_id": item_id,
                "quantity": quantity
            })
            query = self.query_manager.execute_post(stmt)
            return query.fetchone()
        
        except Exception as e:
            print(f"Error creating item-inventory association: {e}")
            return None
    
    def read_by_inventory_id(self, inventory_id):
        try:
            stmt = select(inventory_items_table).where(inventory_items_table.c.inventory_id == inventory_id)
            query = self.query_manager.execute_get(stmt)
            items = query.mappings().all()
            return items or []
        except Exception as e:
            print(f"Error reading items by inventory ID: {e}")
            return []
    
    def find_item_in_inventory(self, inventory_id, item_id):
        """Busca si un item ya existe en el inventario"""
        try:
            stmt = select(inventory_items_table).where(
                inventory_items_table.c.inventory_id == inventory_id,
                inventory_items_table.c.item_id == item_id
            )
            query = self.query_manager.execute_get(stmt)
            item = query.mappings().first()
            return item or None
        except Exception as e:
            print(f"Error finding item in inventory: {e}")
            return None
        
    def read(self):
        try:
            stmt = select(inventory_items_table)
            query = self.query_manager.execute_get(stmt)
            item_inventories = query.mappings().all()
            return item_inventories or None
        except Exception as e:
            print(f"Error reading item-inventory associations: {e}")
            return None
    
    def update(self, item_inventory_id, **kwargs):
        try:
            stmt = update(inventory_items_table).where(inventory_items_table.c.id == item_inventory_id).values(**kwargs)
            query = self.query_manager.execute_update(stmt, "ItemInventory", item_inventory_id)
            return query
        except Exception as e:
            print(f"Error updating item-inventory association: {e}")
            return False
    
    def delete(self, item_inventory_id):
        try:
            stmt = delete(inventory_items_table).where(inventory_items_table.c.id == item_inventory_id)
            query = self.query_manager.execute_delete(stmt, "ItemInventory", item_inventory_id)
            return query
        except Exception as e:
            print(f"Error deleting item-inventory association: {e}")
            return False
    
    def remove_item_from_inventory(self, inventory_id, item_id):
        """Elimina un item específico del inventario"""
        try:
            stmt = delete(inventory_items_table).where(
                inventory_items_table.c.inventory_id == inventory_id,
                inventory_items_table.c.item_id == item_id
            )
            query = self.query_manager.execute_delete(stmt, "ItemInventory", f"{inventory_id}-{item_id}")
            return query
        except Exception as e:
            print(f"Error removing item from inventory: {e}")
            return False