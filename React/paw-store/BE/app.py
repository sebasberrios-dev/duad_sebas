from flask import Flask
from flask_cors import CORS
from routes.users_route import users_bp
from routes.products_route import products_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"]}})

app.register_blueprint(users_bp)
app.register_blueprint(products_bp)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)