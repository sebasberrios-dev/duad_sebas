import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))  

from flask import request, jsonify, Blueprint
from BE.repositories.games_repo import GamesRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

games_repo = GamesRepository()
game_route = Blueprint("game_route", __name__)
controller = Controller()

# Obtiene todas las partidas del sistema (solo admins)
@game_route.route("/games", methods=["GET"])
@require_role('admin')
def get_games():
    try:
        filterable_fields = ["id", "user_id", "title", "description", "link", "is_active"]
        return controller.execute_get_method(games_repo, filterable_fields, "games", date_fields=["created_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@game_route.route("/games/<int:game_id>", methods=["GET"])
@require_auth
def get_game_by_id(game_id):
    # Obtiene una partida específica
    try:
        game = games_repo.read_by_id(game_id)
        
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        serialized_game = controller.serialize_row(game, date_fields=["created_at"])
        return jsonify(serialized_game), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@game_route.route("/games/join/<string:invite_link>", methods=["GET"])
@require_auth
def get_game_by_link(invite_link):
    # Permite a jugadores acceder a una partida mediante enlace de invitación
    try:
        game = games_repo.read_by_link(invite_link)
        
        if not game:
            return jsonify({"error": "Invalid invitation link"}), 404
        
        if not game.get("is_active"):
            return jsonify({"error": "This game is no longer active"}), 403
        
        serialized_game = controller.serialize_row(game, date_fields=["created_at"])
        return jsonify(serialized_game), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Obtiene las partidas creadas por el usuario autenticado
@game_route.route("/my_games", methods=["GET"])
@require_auth
def get_my_games():
    try:
        user_id = request.user.get("id")
        games = games_repo.read_by_user_id(user_id)
        
        if not games:
            return jsonify([]), 200
        
        serialized_games = controller.serialize_list(games, date_fields=["created_at"])
        return jsonify(serialized_games), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Crea una nueva partida (solo DMs)
@game_route.route("/games/new", methods=["POST"])
@require_role('dm')
def create_game():
    try:
        data = request.get_json()
        user_id = request.user.get("id")
        title = data.get("title")
        description = data.get("description")
        link = data.get("link")

        required_fields = ["title", "description", "link"]

        return controller.execute_post_method(
            games_repo,
            required_fields,
            "game",
            user_id=user_id,
            title=title,
            description=description,
            link=link
        )
        
    except Exception as e:
        print(f"ERROR in create_game: {e}")
        return jsonify({"error": str(e)}), 500
    
# Actualiza una partida existente (solo el DM dueño)
@game_route.route("/games/<int:game_id>", methods=["PUT"])
@require_role('dm')
def update_game(game_id):
    try:
        user_id = request.user.get("id")
        
        # Verificar que el DM es dueño de la partida
        game = games_repo.read_by_id(game_id)
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        if game["user_id"] != user_id:
            return jsonify({"error": "You are not authorized to modify this game"}), 403
        
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}

        return controller.execute_put_method(games_repo, game_id, updated_fields, "game")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Activa o desactiva una partida (solo el DM dueño)
@game_route.route("/games/<int:game_id>/toggle-active", methods=["PATCH"])
@require_auth
def toggle_game_active(game_id):
    try:
        user_id = request.user.get("id")
        
        game = games_repo.read_by_id(game_id)

        # Verificar que el usuario es dm o admin
        if request.user.get("role") not in ["dm", "admin"]:
            return jsonify({"error": "Only DMs or admins can toggle game status"}), 403
        
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        if request.user.get("role") == "dm" and game["user_id"] != user_id:
            return jsonify({"error": "You are not authorized to modify this game"}), 403
        
        new_status = not game.get("is_active", True)
        games_repo.update(game_id, is_active=new_status)
        
        status_text = "activated" if new_status else "deactivated"
        return jsonify({"message": f"Game {status_text} successfully", "is_active": new_status}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Elimina una partida 
@game_route.route("/games/<int:game_id>", methods=["DELETE"])
@require_role('admin')
def delete_game(game_id):
    try:        
        game = games_repo.read_by_id(game_id)
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        return controller.execute_delete_method(games_repo, game_id, "game")
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500