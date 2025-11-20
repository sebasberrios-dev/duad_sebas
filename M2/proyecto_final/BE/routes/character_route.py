import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.characters_repo import CharactersRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

characters_route = Blueprint("characters_route", __name__)
characters_repo = CharactersRepository()
controller = Controller()

@characters_route.route("/characters", methods=["GET"])
@require_role('admin')
def get_characters():
    try:
        filterable_fields = ["id", "user_id", "name", "race", "class", "level"]
        return controller.execute_get_method(characters_repo, filterable_fields, "characters")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@characters_route.route("/my_characters", methods=["GET"])
@require_auth
def get_my_characters():
    try:
        user_id = request.user.get("id")
        characters = characters_repo.read_by_user_id(user_id)

        if not characters:
            return jsonify({"error": "No characters available for this user"}), 404
        
        return jsonify(characters), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@characters_route.route("/characters/new", methods=["POST"])
@require_auth
def create_character():
    try:
        data = request.get_json()
        user_id = request.user.get("id")
        name = data.get("name")
        race = data.get("race")
        char_class = data.get("class")
        level = data.get("level")
        attributes = data.get("attributes")
        story = data.get("story")

        required_fields = [name, race, char_class, level, attributes, story]

        return controller.execute_post_method(
            characters_repo,
            required_fields,
            "Character",
            user_id=user_id,
            name=name,
            race=race,
            char_class=char_class,
            level=level,
            attributes=attributes,
            story=story
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@characters_route.route("/characters/update/<int:character_id>", methods=["PUT"])
@require_auth
def update_character(character_id):
    try:
        data = request.get_json()
        updated_fields = {k: v for k, v in data.items() if v is not None}
        
        return controller.execute_put_method(characters_repo, character_id, updated_fields, "Character")
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

@characters_route.route("/characters/delete/<int:character_id>", methods=["DELETE"])
@require_auth
def delete_character(character_id):
    try:
        return controller.execute_delete_method(characters_repo, character_id, "Character")
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500   