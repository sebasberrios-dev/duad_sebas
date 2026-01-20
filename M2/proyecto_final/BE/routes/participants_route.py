import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.participants_repo import ParticipantsRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

part_repo = ParticipantsRepository()
controller = Controller()
part_route = Blueprint("part_route", __name__)

@part_route.route("/participants", methods=["GET"])
@require_role("admin")
def get_participants():
    try:
        filterable_fields = ["id", "game_id", "user_id", "character_id"]
        return controller.execute_get_method(part_repo, filterable_fields, "participants", date_fields=["joined_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@part_route.route("/my_participations", methods=["GET"])
@require_auth
def get_my_participations():
    try:
        user_id = request.user.get("id")
        participants = part_repo.read_by_user_id(user_id)

        if not participants: 
            return jsonify({"error": "No participations available for this user"}), 404

        serialized_participants = controller.serialize_list(participants, date_fields=["joined_at"])
        return jsonify(serialized_participants), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@part_route.route("/game/<int:game_id>/participants", methods=["GET"])
@require_auth
def get_game_participants(game_id):
    # Obtener todos los participantes de una partida
    try:
        # Verificar que el usuario participa en la partida
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
    
@part_route.route("/participants/new", methods=["POST"])
@require_auth
def create_participant():
    try:
        data = request.get_json()
        user_id = request.user.get("id")
        game_id = data.get("game_id")
        character_id = data.get("character_id")
        
        # Verificar que el personaje pertenece al usuario
        from BE.repositories.characters_repo import CharactersRepository
        char_repo = CharactersRepository()
        character = char_repo.read_by_id(character_id)
        
        if not character or character["user_id"] != user_id:
            return jsonify({"error": "Character not found or does not belong to user"}), 403
        
        # Verificar que el usuario no está ya participando en esta partida
        existing = part_repo.read_by_user_and_game(user_id, game_id)
        if existing:
            return jsonify({"error": "User already participating in this game"}), 409
        
        required_fields = ["user_id", "game_id", "character_id"]

        return controller.execute_post_method(part_repo, required_fields, "participant", user_id=user_id, game_id=game_id, character_id=character_id)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500 

@part_route.route("/participants/<int:part_id>", methods=["PUT"])
@require_auth
def update_participant(part_id):
    try:
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}
    
        return controller.execute_put_method(part_repo, part_id, updated_fields, "participant")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@part_route.route("/participants/<int:part_id>", methods=["DELETE"])
@require_auth
def delete_participant(part_id):
    try:
        user_id = request.user.get("id")
        user_role = request.user.get("role")
        
        # Verificar que la participación existe
        participant = part_repo.read_by_id(part_id)
        if not participant:
            return jsonify({"error": "Participant not found"}), 404
        
        # Verificar permisos: el propio usuario, DM de la partida, o admin
        if participant["user_id"] != user_id and user_role not in ["dm", "admin"]:
            return jsonify({"error": "Unauthorized to remove this participant"}), 403
        
        return controller.execute_delete_method(part_repo, part_id, "participant")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

