import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.coins_repo import CoinsRepository
from BE.authorization.auth import require_auth, require_role
from BE.utils.controller import Controller

coins_repo = CoinsRepository()
coins_route = Blueprint("coins_route", __name__)
controller = Controller()

# Obtiene las monedas de un personaje en una partida específica
@coins_route.route("/character/<int:character_id>/<int:game_id>/game_coins", methods=["GET"])
@require_auth
def get_character_game_coins(character_id, game_id):
    try:
        coins = coins_repo.read_by_character_and_game(character_id, game_id)

        if not coins:
            return jsonify({"message": "The character has no coins record in the specified game.", "coins_record": None}), 200
        
        serialized_coins = controller.serialize_row(coins, date_fields=["updated_at"])
        return jsonify(serialized_coins), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Crea un registro de monedas para un personaje en una partida
@coins_route.route("/coins/new", methods=["POST"])
@require_auth
def create_coins_record():
    try:
        data = request.get_json()
        character_id = data.get("character_id")
        game_id = data.get("game_id")
        amount = data.get("amount", 0)

        required_fields = ["character_id", "game_id"]

        return controller.execute_post_method(coins_repo, required_fields, "coins",
            character_id=character_id,
            game_id=game_id,
            amount=amount
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Agrega monedas a un personaje en una partida
@coins_route.route("/coins/add/<int:character_id>/<int:game_id>", methods=["PUT"])
@require_auth
def add_coins_to_character(character_id, game_id):
    try:
        data = request.get_json()
        amount_to_add = data.get("amount", 0)

        coins_record = coins_repo.read_by_character_and_game(character_id, game_id)

        if not coins_record:
            new_coins = coins_repo.create(character_id, game_id, amount_to_add)
            serialized_coins = controller.serialize_row(new_coins, date_fields=["updated_at"])
            return jsonify(serialized_coins), 201

        updated_coins = coins_repo.update_amount(coins_record['id'], coins_record['amount'] + amount_to_add)
        serialized_coins = controller.serialize_row(updated_coins, date_fields=["updated_at"])
        return jsonify(serialized_coins), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Remueve monedas de un personaje en una partida
@coins_route.route("/coins/remove/<int:character_id>/<int:game_id>", methods=["PUT"])
@require_auth
def remove_coins_from_character(character_id, game_id):
    try:
        data = request.get_json()
        amount_to_remove = data.get("amount", 0)

        coins_record = coins_repo.read_by_character_and_game(character_id, game_id)

        if not coins_record:
            return jsonify({"message": "The character has no coins record in the specified game.", "coins_record": None}), 200
        
        if amount_to_remove > coins_record['amount']:
            return jsonify({"error": f"Insufficient coins. Available: {coins_record['amount']}, Requested: {amount_to_remove}"}), 400
        
        new_amount = coins_record['amount'] - amount_to_remove

        updated_coins = coins_repo.update_amount(coins_record['id'], new_amount)
        serialized_coins = controller.serialize_row(updated_coins, date_fields=["updated_at"])
        return jsonify(serialized_coins), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500