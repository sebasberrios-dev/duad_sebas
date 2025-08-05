from flask import Flask
from routes.store_route import store_bp
from routes.user_route import user_bp

app = Flask(__name__)
app.register_blueprint(store_bp)
app.register_blueprint(user_bp)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)