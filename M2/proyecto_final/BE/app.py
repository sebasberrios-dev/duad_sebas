from flask import Flask
from BE.routes.user_route import user_route
from BE.routes.character_route import characters_route
from BE.routes.inventory_route import inventory_route
from BE.routes.participants_route import part_route
from BE.routes.game_route import game_route
from BE.routes.npcs_route import npcs_route
from BE.routes.notes_route import notes_route
from BE.routes.chat_messages_route import chat_route
from BE.routes.dart_throws_route import dart_throws_route

app = Flask(__name__)

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
    except Exception as e:
        print(f"Error registering routes: {e}")
    
register_routes(app)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

