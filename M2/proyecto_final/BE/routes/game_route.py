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

@game_route.route("/games", methods=["GET"])
@require_role('admin')
def get_games():
    try:
        filterable_fields = ["id", "dm_id", "title", "description", "link"]
        return controller.execute_get_method(games_repo, filterable_fields, "games")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@game_route.route("/my_games", methods=["GET"])
@require_role('dm')
def get_my_games():
    try:
        dm_id = request.user.get("id")
        games = games_repo.read_by_dm_id(dm_id)
        
        if not games:
            return jsonify({"error": "No games available for this DM"}), 404
        
        return jsonify(games), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@game_route.route("/games/new", methods=["POST"])
@require_role('dm')
def create_game():
    try:
        data = request.get_json()
        dm_id = request.user.get("id")
        title = data.get("title")
        description = data.get("description")
        link = data.get("link")

        required_fields = [title, description, link]

        return controller.execute_post_method(
            games_repo,
            required_fields,
            "Game",
            dm_id=dm_id,
            title=title,
            description=description,
            link=link
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@game_route.route("/games/<int:game_id>", methods=["PUT"])
@require_role('dm')
def update_game(game_id):
    try:
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}

        return controller.execute_put_method(games_repo, game_id, updated_fields, "Game")

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@game_route.route("/games/<int:game_id>", methods=["DELETE"])
@require_role('dm')
def delete_game(game_id):
    try:
        return controller.execute_delete_method(games_repo, game_id, "Game")
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500