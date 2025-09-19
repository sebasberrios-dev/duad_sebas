from flask import Flask 
from routes.inicialize_route import inicialize_bp
from routes.user_route import user_bp
from routes.car_route import car_bp
from routes.rental_route import rental_bp

app = Flask(__name__)

app.register_blueprint(inicialize_bp)
app.register_blueprint(user_bp)
app.register_blueprint(car_bp)
app.register_blueprint(rental_bp)

if __name__ == '__main__':
    app.run(debug=True)
