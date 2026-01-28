import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.npcs_repo import NPCRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

npc_repo = NPCRepository()
controller = Controller()
npcs_route = Blueprint("npcs_route", __name__)

# Obtiene todos los NPCs de una partida (solo el DM dueño)
@npcs_route.route("/game/<int:game_id>/npcs", methods=["GET"])
@require_role('dm')
def get_game_npcs(game_id):
    try:
        from BE.repositories.games_repo import GamesRepository
        games_repo = GamesRepository()
        
        user_id = request.user.get("id")
        game = games_repo.read_by_id(game_id)
        
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        if game["user_id"] != user_id:
            return jsonify({"error": "Only the owner can view NPCs for this game"}), 403
        
        npcs = npc_repo.read_by_game_id(game_id)
        
        if not npcs:
            return jsonify([]), 200
        
        serialized_npcs = controller.serialize_list(npcs, date_fields=["created_at"])
        return jsonify(serialized_npcs), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Obtiene un NPC específico por ID
@npcs_route.route("/npcs/<int:npc_id>", methods=["GET"])
@require_auth
def get_npc_by_id(npc_id):
    try:
        npc = npc_repo.read_by_id(npc_id)

        if not npc: 
            return jsonify({"error": "NPC not found"}), 404
        
        serialized_npc = controller.serialize_row(npc, date_fields=["created_at"])
        return jsonify(serialized_npc), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Crea un nuevo NPC en una partida (solo el DM dueño)
@npcs_route.route("/npcs/new", methods=["POST"])
@require_role('dm')
def create_npc():
    try:
        from BE.repositories.games_repo import GamesRepository
        games_repo = GamesRepository()
        
        data = request.get_json()
        game_id = data.get("game_id")

        user_id = request.user.get("id")
        game = games_repo.read_by_id(game_id)
        
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        if game["user_id"] != user_id:
            return jsonify({"error": "Only the owner can create NPCs for this game"}), 403
        
        name = data.get("name")
        role = data.get("role")
        level = data.get("level", 1)  
        description = data.get("description")
        attributes = data.get("attributes")
        hp = data.get("hp", 15)  

        required_fields = ["game_id", "name", "role", "description", "attributes", "hp"]

        return controller.execute_post_method(
            npc_repo, required_fields, "npc",
            game_id=game_id, name=name, role=role,
            level=level, description=description, attributes=attributes, hp=hp)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Actualiza un NPC existente (solo el DM dueño)
@npcs_route.route("/npcs/<int:npc_id>", methods=["PUT"])
@require_role('dm')
def update_npc(npc_id):
    try:
        from BE.repositories.games_repo import GamesRepository
        games_repo = GamesRepository()
        
        npc = npc_repo.read_by_id(npc_id)
        if not npc:
            return jsonify({"error": "NPC not found"}), 404
        
        user_id = request.user.get("id")
        game = games_repo.read_by_id(npc["game_id"])
        
        if game["user_id"] != user_id:
            return jsonify({"error": "Only the owner can update NPCs for this game"}), 403
        
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}
    
        return controller.execute_put_method(npc_repo, npc_id, updated_fields, "npc")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Elimina un NPC (solo el DM dueño)
@npcs_route.route("/npcs/<int:npc_id>", methods=["DELETE"])
@require_role('dm')
def delete_npc(npc_id):
    try:
        from BE.repositories.games_repo import GamesRepository
        games_repo = GamesRepository()

        npc = npc_repo.read_by_id(npc_id)
        if not npc:
            return jsonify({"error": "NPC not found"}), 404

        user_id = request.user.get("id")
        game = games_repo.read_by_id(npc["game_id"])
        
        if game["user_id"] != user_id:
            return jsonify({"error": "Only the owner can delete NPCs for this game"}), 403
        
        return controller.execute_delete_method(npc_repo, npc_id, "npc")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500