import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from flask import Flask
from flask_cors import CORS
from routes.user_route import user_route
from routes.character_route import characters_route
from routes.inventory_route import inventory_route
from routes.participants_route import part_route
from routes.game_route import game_route
from routes.npcs_route import npcs_route
from routes.notes_route import notes_route
from routes.chat_messages_route import chat_route
from routes.dart_throws_route import dart_throws_route
from routes.combat_route import combat_route
from routes.coins_route import coins_route

app = Flask(__name__)
CORS(app)

def register_routes(app):
    try:
        app.register_blueprint(user_route)
        app.register_blueprint(characters_route)
        app.register_blueprint(inventory_route)
        app.register_blueprint(part_route)
        app.register_blueprint(game_route)
        app.register_blueprint(npcs_route)
        app.register_blueprint(notes_route)
        app.register_blueprint(chat_route)
        app.register_blueprint(dart_throws_route)
        app.register_blueprint(combat_route)
        app.register_blueprint(coins_route)
    except Exception as e:
        print(f"Error registering routes: {e}")
    
register_routes(app)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

