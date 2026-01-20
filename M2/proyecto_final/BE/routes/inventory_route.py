import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.inventory_repo import InventoryRepository, ItemRepository, ItemInventoryRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

inventory_route = Blueprint("inventory_route", __name__)
inventory_repo = InventoryRepository()
item_repo = ItemRepository()
item_inventory_repo = ItemInventoryRepository()
controller = Controller()

# ==================== RUTAS DE INVENTARIOS ====================

@inventory_route.route("/inventories", methods=["GET"])
@require_role('admin')
def get_inventories():
    try:
        filterable_fields = ["id", "character_id"]
        return controller.execute_get_method(inventory_repo, filterable_fields, "inventories", date_fields=["updated_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_route.route("/my_inventory", methods=["GET"])
@require_auth
def get_my_inventory():
    # Obtiene el inventario completo de un personaje con todos sus items
    try:
        character_id = request.args.get("character_id")
        
        if not character_id:
            return jsonify({"error": "character_id is required"}), 400
        
        # Obtener inventario con todos los items
        inventory_items = inventory_repo.get_inventory_with_items(character_id)
        
        if not inventory_items:
            return jsonify({"message": "Inventory is empty", "items": []}), 200
        
        serialized_items = controller.serialize_list(inventory_items)
        return jsonify({"items": serialized_items}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@inventory_route.route("/inventory/new", methods=["POST"])
@require_auth
def create_inventory():
    # Crea un inventario vacío para un personaje
    try:
        data = request.get_json()
        character_id = data.get("character_id")
        
        if not character_id:
            return jsonify({"error": "character_id is required"}), 400

        # Verificar si ya tiene inventario
        existing = inventory_repo.read_by_character_id(character_id)
        if existing:
            return jsonify({"error": "Character already has an inventory"}), 409

        result = inventory_repo.create(character_id)
        
        if result:
            return jsonify({"message": "Inventory created successfully", "inventory_id": result.id}), 201
        else:
            return jsonify({"error": "Could not create inventory"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_route.route("/inventory/<int:inventory_id>", methods=["DELETE"])
@require_role('admin')
def delete_inventory(inventory_id):
    try:
        success = inventory_repo.delete(inventory_id)
        if success:
            return jsonify({"message": f"Inventory {inventory_id} deleted successfully"}), 200
        else:
            return jsonify({"error": "Could not delete inventory"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==================== RUTAS DE ITEMS (CATÁLOGO) ====================

@inventory_route.route("/items", methods=["GET"])
@require_auth
def get_items():
    """Obtiene todos los items disponibles del catálogo"""
    try:
        filterable_fields = ["id", "name", "type", "rarity"]
        return controller.execute_get_method(item_repo, filterable_fields, "items", date_fields=["created_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_route.route("/items/new", methods=["POST"])
@require_role('dm')
def create_item():
    # Crea un nuevo item en el catálogo (solo DM)
    try:
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        item_type = data.get("type")
        attributes = data.get("attributes", {})
        rarity = data.get("rarity", "common")

        required_fields = ["name", "description", "item_type", "rarity"]
        
        return controller.execute_post_method(
            item_repo, required_fields, "item",
            name=name, description=description, item_type=item_type,
            attributes=attributes, rarity=rarity)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_route.route("/items/<int:item_id>", methods=["PUT"])
@require_role('dm')
def update_item(item_id):
    # Actualiza un item del catálogo (solo DM)
    try:
        data = request.get_json()
        updated_fields = {k: v for k, v in data.items() if v is not None}

        return controller.execute_put_method(
            item_repo, item_id, updated_fields, "item")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_route.route("/items/<int:item_id>", methods=["DELETE"])
@require_role('admin')
def delete_item(item_id):
    # Elimina un item del catálogo (solo admin)
    try:
        success = item_repo.delete(item_id)
        if success:
            return jsonify({"message": f"Item {item_id} deleted successfully"}), 200
        else:
            return jsonify({"error": "Could not delete item"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==================== RUTAS DE GESTIÓN DE ITEMS EN INVENTARIO ====================

@inventory_route.route("/inventory/add_item", methods=["POST"])
@require_auth
def add_item_to_inventory():
    # Añade un item al inventario de un personaje
    try:
        data = request.get_json()
        character_id = data.get("character_id")
        item_id = data.get("item_id")
        quantity = data.get("quantity", 1)

        if not character_id or not item_id:
            return jsonify({"error": "character_id and item_id are required"}), 400

        # Verificar que el item existe
        item = item_repo.read_by_id(item_id)
        if not item:
            return jsonify({"error": "Item not found"}), 404

        # Obtener o crear inventario
        inventory = inventory_repo.read_by_character_id(character_id)
        if not inventory:
            result = inventory_repo.create(character_id)
            inventory_id = result.id
        else:
            inventory_id = inventory["id"]

        # Verificar si el item ya está en el inventario
        existing_item = item_inventory_repo.find_item_in_inventory(inventory_id, item_id)
        
        if existing_item:
            # Actualizar cantidad
            new_quantity = existing_item["quantity"] + quantity
            item_inventory_repo.update(existing_item["id"], quantity=new_quantity)
            return jsonify({"message": "Item quantity updated", "new_quantity": new_quantity}), 200
        else:
            # Añadir nuevo item
            result = item_inventory_repo.create(inventory_id, item_id, quantity)
            if result:
                return jsonify({"message": "Item added to inventory", "item_inventory_id": result.id}), 201
            else:
                return jsonify({"error": "Could not add item"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_route.route("/inventory/remove_item", methods=["DELETE"])
@require_auth
def remove_item_from_inventory():
    # Elimina un item del inventario de un personaje
    try:
        data = request.get_json()
        character_id = data.get("character_id")
        item_id = data.get("item_id")
        quantity = data.get("quantity", 1)

        if not character_id or not item_id:
            return jsonify({"error": "character_id and item_id are required"}), 400

        # Obtener inventario
        inventory = inventory_repo.read_by_character_id(character_id)
        if not inventory:
            return jsonify({"error": "Inventory not found"}), 404

        inventory_id = inventory["id"]

        # Buscar el item en el inventario
        existing_item = item_inventory_repo.find_item_in_inventory(inventory_id, item_id)
        
        if not existing_item:
            return jsonify({"error": "Item not found in inventory"}), 404

        current_quantity = existing_item["quantity"]
        
        if quantity >= current_quantity:
            # Eliminar completamente el item
            item_inventory_repo.delete(existing_item["id"])
            return jsonify({"message": "Item removed from inventory"}), 200
        else:
            # Reducir cantidad
            new_quantity = current_quantity - quantity
            item_inventory_repo.update(existing_item["id"], quantity=new_quantity)
            return jsonify({"message": "Item quantity updated", "new_quantity": new_quantity}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_route.route("/inventory/update_quantity", methods=["PUT"])
@require_auth
def update_item_quantity():
    # Actualiza la cantidad de un item en el inventario
    try:
        data = request.get_json()
        character_id = data.get("character_id")
        item_id = data.get("item_id")
        new_quantity = data.get("quantity")

        if not character_id or not item_id or new_quantity is None:
            return jsonify({"error": "character_id, item_id and quantity are required"}), 400

        if new_quantity < 0:
            return jsonify({"error": "Quantity cannot be negative"}), 400

        # Obtener inventario
        inventory = inventory_repo.read_by_character_id(character_id)
        if not inventory:
            return jsonify({"error": "Inventory not found"}), 404

        inventory_id = inventory["id"]

        # Buscar el item en el inventario
        existing_item = item_inventory_repo.find_item_in_inventory(inventory_id, item_id)
        
        if not existing_item:
            return jsonify({"error": "Item not found in inventory"}), 404

        if new_quantity == 0:
            # Eliminar el item
            item_inventory_repo.delete(existing_item["id"])
            return jsonify({"message": "Item removed from inventory"}), 200
        else:
            # Actualizar cantidad
            item_inventory_repo.update(existing_item["id"], quantity=new_quantity)
            return jsonify({"message": "Quantity updated", "new_quantity": new_quantity}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500