import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.combat_repo import CombatRepository
from BE.repositories.npcs_repo import NPCRepository
from BE.repositories.games_repo import GamesRepository
from BE.authorization.auth import require_auth
from BE.utils.controller import Controller

combat_repo = CombatRepository()
npc_repo = NPCRepository()
games_repo = GamesRepository()
controller = Controller()
combat_route = Blueprint("combat_route", __name__)

@combat_route.route("/combat/start", methods=["POST"])
@require_auth
def start_combat():
    # Inicia un combate con un NPC en una partida
    try:
        data = request.get_json()
        required_fields = ["game_id", "npc_id"]
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        game_id = data["game_id"]
        npc_id = data["npc_id"]
        
        # Verificar que el juego existe y está activo
        game = games_repo.read_by_id(game_id)
        if not game or not game["is_active"]:
            return jsonify({"error": "Game not found or inactive"}), 404
        
        # Obtener datos del NPC
        npc = npc_repo.read_by_id(npc_id)
        if not npc:
            return jsonify({"error": "NPC not found"}), 404
        
        # Calcular tiradas máximas basadas en nivel del NPC (más nivel = más tiradas permitidas)
        max_rolls = max(3, min(10, npc["level"] + 2))  # Entre 3 y 10 tiradas
        
        # Crear estado de combate
        combat = combat_repo.create_combat(
            game_id=game_id,
            npc_id=npc_id,
            npc_current_hp=npc["hp"],
            npc_max_hp=npc["hp"],
            max_rolls=max_rolls
        )
        
        if not combat:
            return jsonify({"error": "Failed to create combat"}), 500
        
        return jsonify({
            "combat_id": combat[0],
            "npc_name": npc["name"],
            "npc_level": npc["level"],
            "npc_hp": npc["hp"],
            "max_rolls": max_rolls,
            "current_rolls": 0
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@combat_route.route("/combat/attack", methods=["POST"])
@require_auth
def attack_npc():
    # Registra un ataque al NPC en el combate activo
    try:
        data = request.get_json()
        required_fields = ["game_id", "damage"]
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        game_id = data["game_id"]
        damage = data["damage"]
        
        # Obtener combate activo
        combat = combat_repo.get_active_combat(game_id)
        if not combat:
            return jsonify({"error": "No active combat found"}), 404
        
        # Verificar si ya se alcanzó el límite de tiradas
        if combat["current_rolls"] >= combat["max_rolls"]:
            return jsonify({
                "error": "Max rolls reached",
                "result": "defeat"
            }), 400
        
        # Registrar el ataque
        updated_combat = combat_repo.register_attack(combat["id"], damage)
        
        if not updated_combat:
            return jsonify({"error": "Failed to register attack"}), 500
        
        # Verificar resultado del combate
        result = "ongoing"
        if updated_combat["npc_current_hp"] <= 0:
            result = "victory"
            combat_repo.end_combat(combat["id"])
        elif updated_combat["current_rolls"] >= updated_combat["max_rolls"]:
            result = "defeat"
            combat_repo.end_combat(combat["id"])
            
            # Terminar la partida automáticamente cuando el jugador pierde
            game = games_repo.read_by_id(game_id)
            if game and game.get("is_active"):
                games_repo.update(game_id, is_active=False)
        
        serialized_combat = Controller.serialize_row(updated_combat, date_fields=["created_at"])
        serialized_combat["result"] = result
        
        return jsonify(serialized_combat), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@combat_route.route("/combat/<int:game_id>/active", methods=["GET"])
@require_auth
def get_active_combat(game_id):
    # Obtiene el estado del combate activo en una partida
    try:
        combat = combat_repo.get_active_combat(game_id)
        
        if not combat:
            return jsonify({"message": "No active combat"}), 404
        
        serialized_combat = Controller.serialize_row(combat, date_fields=["created_at"])
        return jsonify(serialized_combat), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
