import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.participants_repo import ParticipantsRepository
from BE.repositories.characters_repo import CharactersRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

part_repo = ParticipantsRepository()
controller = Controller()
part_route = Blueprint("part_route", __name__)

# Obtiene todos los participantes del sistema (solo admins)
@part_route.route("/participants", methods=["GET"])
@require_role("admin")
def get_participants():
    try:
        filterable_fields = ["id", "game_id", "user_id", "character_id"]
        return controller.execute_get_method(part_repo, filterable_fields, "participants", date_fields=["joined_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Obtiene las participaciones del usuario autenticado
@part_route.route("/my_participations", methods=["GET"])
@require_auth
def get_my_participations():
    try:
        user_id = request.user.get("id")
        participants = part_repo.read_by_user_id(user_id)

        if not participants: 
            return jsonify([]), 200

        serialized_participants = controller.serialize_list(participants, date_fields=["joined_at"])
        return jsonify(serialized_participants), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtener todos los participantes de una partida
@part_route.route("/game/<int:game_id>/participants", methods=["GET"])
@require_auth
def get_game_participants(game_id):
    try:
        user_id = request.user.get("id")
        
        participant = part_repo.read_by_user_and_game(user_id, game_id)
        if not participant:
                return jsonify({"error": "Unauthorized to view participants"}), 403
        
        participants = part_repo.read_by_game_id(game_id)
        
        if not participants:
            return jsonify([]), 200
        
        serialized_participants = controller.serialize_list(participants, date_fields=["joined_at"])
        return jsonify(serialized_participants), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Crea una participación (jugador se une a una partida con un personaje)
@part_route.route("/participants/new", methods=["POST"])
@require_auth
def create_participant():
    try:
        data = request.get_json()
        user_id = request.user.get("id")
        game_id = data.get("game_id")
        character_id = data.get("character_id")
        
        char_repo = CharactersRepository()
        character = char_repo.read_by_id(character_id)
        
        if not character or character["user_id"] != user_id:
            return jsonify({"error": "Character not found or does not belong to user"}), 403
        
        existing = part_repo.read_by_user_and_game(user_id, game_id)
        if existing:
            return jsonify({"error": "User already participating in this game"}), 409
        
        required_fields = ["user_id", "game_id", "character_id"]

        return controller.execute_post_method(part_repo, required_fields, "participant", user_id=user_id, game_id=game_id, character_id=character_id)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500 


# Crea participación automática para el DM creador de la partida
@part_route.route("/participants/new_owner", methods=["POST"])
@require_role("dm")
def create_participation_to_owner():
    try:
        data = request.get_json()
        user_id = request.user.get("id")
        game_id = data.get("game_id")

        if not game_id:
            return jsonify({"error": "Missing game_id to create participant"}), 400

        existing = part_repo.read_by_user_and_game(user_id, game_id)
        if existing:
            return jsonify({"error": "DM already owned this game"}), 409
        
        new_owner = part_repo.create_owner_participation(user_id, game_id)

        if new_owner:
            return jsonify({"message": "Owner participation created successfully.", "owner_id": new_owner.id}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Actualiza una participación
@part_route.route("/participants/<int:part_id>", methods=["PUT"])
@require_auth
def update_participant(part_id):
    try:
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}
    
        return controller.execute_put_method(part_repo, part_id, updated_fields, "participant")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Elimina una participación (salir de una partida)
@part_route.route("/participants/<int:part_id>", methods=["DELETE"])
@require_auth
def delete_participant(part_id):
    try:
        user_id = request.user.get("id")
        user_role = request.user.get("role")
        
        participant = part_repo.read_by_id(part_id)
        if not participant:
            return jsonify({"error": "Participant not found"}), 404

        if participant["user_id"] != user_id and user_role not in ["dm", "admin"]:
            return jsonify({"error": "Unauthorized to remove this participant"}), 403
        
        return controller.execute_delete_method(part_repo, part_id, "participant")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

