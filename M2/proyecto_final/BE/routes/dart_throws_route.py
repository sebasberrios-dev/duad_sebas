import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.darts_throw_repo import DartThrowRepository
from BE.authorization.auth import require_auth, require_role
from BE.repositories.participants_repo import ParticipantsRepository
from BE.utils.controller import Controller

dart_throw_repo = DartThrowRepository()
participants_repo = ParticipantsRepository()
dart_throws_route = Blueprint("dart_throws_route", __name__)
controller = Controller()

# Obtiene todas las tiradas de dados del sistema (solo admins)
@dart_throws_route.route("/throws", methods=["GET"])
@require_role('admin')
def get_throws():
    try:
        filterable_fields = ["id", "game_id", "participant_id", "dart_type", "throw_value"]
        return controller.execute_get_method(dart_throw_repo, filterable_fields, "darts_throws", date_fields=["thrown_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Obtiene las tiradas de una partida (filtradas por visibilidad)
@dart_throws_route.route("/game/<int:game_id>/throws", methods=["GET"])
@require_auth
def get_game_throws(game_id):
    try:
        user_id = request.user.get("id")
        user_role = request.user.get("role")
        
        if user_role != "dm":
            participant = participants_repo.read_by_user_and_game(user_id, game_id)
            if not participant:
                return jsonify({"error": "User is not a participant in this game"}), 403
        
        all_throws = dart_throw_repo.read_by_game_id(game_id)
        
        if not all_throws:
            return jsonify([]), 200
        
        if user_role == "dm":
            visible_throws = all_throws
        else:
            visible_throws = [throw for throw in all_throws if throw.get("visible_to_players", False)]
        
        serialized_throws = controller.serialize_list(visible_throws, date_fields=["thrown_at"])
        return jsonify(serialized_throws), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Obtiene las tiradas del usuario autenticado en su partida actual
@dart_throws_route.route("/my_throws", methods=["GET"])
@require_auth
def get_my_throws():
    try:
        user_id = request.user.get("id")
        user_part = participants_repo.read_by_user_id(user_id)

        game_throws = dart_throw_repo.read_by_game_id(user_part["game_id"])
        
        if not game_throws:
            return jsonify({"error": "No throws available for this game"}), 404

        serialized_throws = controller.serialize_list(game_throws, date_fields=["thrown_at"])
        
        return jsonify(serialized_throws), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Obtiene todas las tiradas de la partida del DM
@dart_throws_route.route("/dm_throws", methods=["GET"])
@require_role('dm')
def get_dm_throws():
    try:
        user_id = request.user.get("id")
        dm_part = participants_repo.read_by_user_id(user_id)
        
        game_throws = dart_throw_repo.read_by_game_id(dm_part["game_id"])

        if not game_throws:
            return jsonify({"error": "No throws available for this game"}), 404
        
        serialized_throws = controller.serialize_list(game_throws, date_fields=["thrown_at"])
        
        return jsonify(serialized_throws), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Crea una nueva tirada de dados (jugadores)
@dart_throws_route.route("/throws/new", methods=["POST"])
@require_auth
def create_throw():
    try:
        data = request.get_json()
        game_id = data.get("game_id")
        participant_id = data.get("participant_id")
        dart_type = data.get("dart_type")
        visible_to_dm = data.get("visible_to_dm", True)
        visible_to_players = data.get("visible_to_players", True)
        throw_value = data.get("throw_value")

        required_fields = ["game_id", "participant_id", "dart_type", "visible_to_dm", "visible_to_players", "throw_value"]

        return controller.execute_post_method(dart_throw_repo, required_fields, "dart_throw",
            game_id=game_id,
            participant_id=participant_id,
            dart_type=dart_type,
            visible_to_dm=visible_to_dm,
            visible_to_players=visible_to_players,
            throw_value=throw_value
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Crea una nueva tirada de dados (solo DMs, puede ser oculta para jugadores)
@dart_throws_route.route("/dm_throws/new", methods=["POST"])
@require_role('dm')
def create_dm_throw():
    try:
        data = request.get_json()
        game_id = data.get("game_id")
        participant_id = data.get("participant_id") 
        dart_type = data.get("dart_type")
        visible_to_dm = data.get("visible_to_dm", True)
        visible_to_players = data.get("visible_to_players", False)
        throw_value = data.get("throw_value")

        required_fields = ["game_id", "participant_id", "dart_type", "visible_to_dm", "visible_to_players", "throw_value"]
        return controller.execute_post_method(dart_throw_repo, required_fields, "dart_throw",
            game_id=game_id,
            participant_id=participant_id,
            dart_type=dart_type,
            visible_to_dm=visible_to_dm,
            visible_to_players=visible_to_players,
            throw_value=throw_value
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Actualiza una tirada existente
@dart_throws_route.route("/throws/<int:dt_id>", methods=["PUT"])
@require_auth
def update_throw(dt_id):
    try:
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}
    
        return controller.execute_put_method(dart_throw_repo, dt_id, updated_fields, "dart throw")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Elimina una tirada
@dart_throws_route.route("/throws/<int:dt_id>", methods=["DELETE"])
@require_auth
def delete_throw(dt_id):
    try:
        return controller.execute_delete_method(dart_throw_repo, dt_id, "dart throw")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  