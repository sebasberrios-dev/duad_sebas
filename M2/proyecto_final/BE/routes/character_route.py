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
        return controller.execute_get_method(characters_repo, filterable_fields, "characters", date_fields=["created_at"])
    
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
        
        serialized_characters = controller.serialize_list(characters, date_fields=["created_at"])
        return jsonify(serialized_characters), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@characters_route.route("/characters/<int:character_id>", methods=["GET"])
@require_auth
def get_character_by_id(character_id):
    try:
        user_id = request.user.get("id")
        user_role = request.user.get("role")
        
        character = characters_repo.read_by_id(character_id)
        if not character:
            return jsonify({"error": "Character not found"}), 404
        
        # Verificar propiedad o rol admin
        if character["user_id"] != user_id and user_role != "admin":
            return jsonify({"error": "Unauthorized to view this character"}), 403
        
        serialized_character = controller.serialize_row(character, date_fields=["created_at"])
        return jsonify(serialized_character), 200
    
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

        required_fields = ["user_id", "name", "race", "char_class", "level", "attributes", "story"]

        return controller.execute_post_method(
            characters_repo, required_fields, "character",
            user_id=user_id, name=name, race=race, char_class=char_class,
            level=level, attributes=attributes, story=story)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@characters_route.route("/characters/update/<int:character_id>", methods=["PUT"])
@require_auth
def update_character(character_id):
    try:
        user_id = request.user.get("id")
        
        # Verificar que el personaje existe y pertenece al usuario
        character = characters_repo.read_by_id(character_id)
        if not character:
            return jsonify({"error": "Character not found"}), 404
        
        if character["user_id"] != user_id:
            return jsonify({"error": "Unauthorized to update this character"}), 403
        
        data = request.get_json()
        updated_fields = {k: v for k, v in data.items() if v is not None}
        
        return controller.execute_put_method(characters_repo, character_id, updated_fields, "Character")
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

@characters_route.route("/characters/delete/<int:character_id>", methods=["DELETE"])
@require_auth
def delete_character(character_id):
    try:
        user_id = request.user.get("id")
        
        # Verificar que el personaje existe y pertenece al usuario
        character = characters_repo.read_by_id(character_id)
        if not character:
            return jsonify({"error": "Character not found"}), 404
        
        if character["user_id"] != user_id:
            return jsonify({"error": "Unauthorized to delete this character"}), 403
        
        return controller.execute_delete_method(characters_repo, character_id, "Character")
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500   