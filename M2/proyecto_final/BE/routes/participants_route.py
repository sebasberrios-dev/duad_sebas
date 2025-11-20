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
        return controller.execute_get_method(part_repo, filterable_fields, "participants")
    
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
        
        return jsonify(participants), 200
    
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
        required_fields = [game_id, character_id]

        return controller.execute_post_method(part_repo, required_fields, "Participant", user_id=user_id, game_id=game_id, character_id=character_id)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500 

@part_route.route("/participants/<int:part_id>", methods=["PUT"])
@require_auth
def update_participant(part_id):
    try:
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}
    
        return controller.execute_put_method(part_repo, part_id, updated_fields, "Participant")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@part_route.route("/participants/<int:part_id>", methods=["DELETE"])
@require_auth
def delete_participant(part_id):
    try:
        return controller.execute_delete_method(part_repo, part_id, "Participant")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

