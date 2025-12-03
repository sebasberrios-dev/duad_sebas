import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.chat_messages_repo import ChatRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

chat_repo = ChatRepository()
chat_route = Blueprint("chat_route", __name__)
controller = Controller()

@chat_route.route("/chat", methods=["GET"])
@require_role('admin')
def get_chat_messages():
    try:
        filterable_fields = ["id", "game_id", "user_id", "message"]
        return controller.execute_get_method(chat_repo, filterable_fields, "chat_messages", date_fields=["sent_at"])
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@chat_route.route("/my_chat_messages", methods=["GET"])
@require_auth
def get_my_chat_messages():
    try:
        user_id = request.user.get("id")
        chat_messages = chat_repo.read_by_user_id(user_id)

        if not chat_messages:
            return jsonify({"error": "No chat messages available for this user"}), 404
        
        serialized_messages = controller.serialize_list(chat_messages, date_fields=["sent_at"])
        return jsonify(serialized_messages), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_route.route("/game_chat_messages/<int:game_id>", methods=["GET"])
@require_auth
def get_game_chat_messages(game_id):
    try:
        chat_messages = chat_repo.read_by_game_id(game_id)

        if not chat_messages:
            return jsonify({"error": "No chat messages available for this game"}), 404
        
        serialized_messages = controller.serialize_list(chat_messages, date_fields=["sent_at"])
        return jsonify(serialized_messages), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_route.route("/chat/new", methods=["POST"])
@require_auth
def create_chat_message():
    try:
        data = request.get_json()
        user_id = request.user.get("id")
        game_id = data.get("game_id")
        message = data.get("message")
        required_fields = ["game_id", "message"]

        return controller.execute_post_method(chat_repo, required_fields, "chat message", user_id=user_id, game_id=game_id, message=message)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_route.route("/chat/<int:message_id>", methods=["PUT"])
@require_auth
def update_chat_message(message_id):
    try:
        data = request.get_json()
        updated_fields = {k: v for k,v in data.items() if v is not None}
    
        return controller.execute_put_method(chat_repo, message_id, updated_fields, "chat message")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_route.route("/chat/<int:message_id>", methods=["DELETE"])
@require_auth
def delete_chat_message(message_id):
    try:
        return controller.execute_delete_method(chat_repo, message_id, "chat message")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    