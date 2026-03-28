import os
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from extensions import mail
from routes.users_route import users_bp
from routes.products_route import products_bp
from routes.purchase_flow_route import purchase_flow_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": os.getenv('CORS_ORIGINS')}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])

    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False

    mail.init_app(app)

    app.register_blueprint(users_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(purchase_flow_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host=os.getenv('APP_HOST'), port=int(os.getenv('APP_PORT')), debug=True)