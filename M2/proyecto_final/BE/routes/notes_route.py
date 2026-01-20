import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.notes_repo import NotesRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

notes_route = Blueprint("notes_route", __name__)
notes_repo = NotesRepository()
controller = Controller()

# Obtiene todas las notas del sistema (solo admins)
@notes_route.route("/notes", methods=["GET"])
@require_role('admin')
def get_notes():
    try:
        filterable_fields = ["id", "user_id", "content", "visible_for_players", "visible_for_dm"]
        return controller.execute_get_method(notes_repo, filterable_fields, "notes", date_fields=["updated_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtiene todas las notas del usuario autenticado
@notes_route.route("/my_notes", methods=["GET"])
@require_auth
def get_my_notes():
    try:
        user_id = request.user.get("id")
        notes = notes_repo.read_by_user_id(user_id)
        if not notes:
            return jsonify({"message": "No notes available", "notes": []}), 200
        
        serialized_notes = controller.serialize_list(notes, date_fields=["updated_at"])
        return jsonify(serialized_notes), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtiene todas las notas de una partida (filtradas por visibilidad)
@notes_route.route("/game/<int:game_id>/notes", methods=["GET"])
@require_auth
def get_game_notes(game_id):
    try:
        user_id = request.user.get("id")
        user_role = request.user.get("role")
        
        notes = notes_repo.read_by_game_id_with_username(game_id)
        
        if not notes:
            return jsonify({"message": "No notes available", "notes": []}), 200
        
        if user_role == 'dm':
            filtered_notes = notes
        else:
            filtered_notes = [
                note for note in notes
                if note.get("visible_for_players") or note.get("user_id") == user_id
            ]
        
        serialized_notes = controller.serialize_list(filtered_notes, date_fields=["updated_at"])
        return jsonify({"notes": serialized_notes}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Crea una nota (privada para jugadores, puede ser compartida para DM)
@notes_route.route("/notes/new", methods=["POST"])
@require_auth
def create_note():
    try:
        data = request.get_json()
        user_id = request.user.get("id")
        user_role = request.user.get("role")
        game_id = data.get("game_id")
        content = data.get("content")
        
        if user_role == 'dm':
            visible_for_players = data.get("visible_for_players", False)
            visible_for_dm = True  
        else:
            visible_for_players = data.get("visible_for_players", False)
            visible_for_dm = data.get("visible_for_dm", True)  

        required_fields = ["game_id", "content"]
        
        if not game_id or not content:
            return jsonify({"error": "game_id and content are required"}), 400
        
        return controller.execute_post_method(
            notes_repo, required_fields, "note",
            user_id=user_id, game_id=game_id, content=content,
            visible_for_players=visible_for_players,
            visible_for_dm=visible_for_dm)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Actualiza una nota existente (solo el creador)
@notes_route.route("/notes/<int:note_id>", methods=["PUT"])
@require_auth
def update_note(note_id):
    try:
        user_id = request.user.get("id")
        
        note = notes_repo.read_by_id(note_id)
        if not note:
            return jsonify({"error": "Note not found"}), 404
        
        if note["user_id"] != user_id:
            return jsonify({"error": "You are not authorized to edit this note"}), 403
        
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}

        return controller.execute_put_method(notes_repo, note_id, updated_fields, "note")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Elimina una nota (solo el creador)
@notes_route.route("/notes/<int:note_id>", methods=["DELETE"])
@require_auth
def delete_note(note_id):
    try:
        user_id = request.user.get("id")
        
        note = notes_repo.read_by_id(note_id)
        if not note:
            return jsonify({"error": "Note not found"}), 404
        
        if note["user_id"] != user_id:
            return jsonify({"error": "You are not authorized to delete this note"}), 403
        
        return controller.execute_delete_method(notes_repo, note_id, "note")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500