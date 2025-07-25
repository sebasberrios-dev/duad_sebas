from db.db_manager import db_manager
from db.tables import TablesRepository
from flask import Blueprint, jsonify

inicialize_bp = Blueprint('inicialize_bp', __name__)
tables_repo = TablesRepository(db_manager)

@inicialize_bp.route('/user_table', methods=['POST'])
def create_users_table():
    if tables_repo.create_user_table():
        return jsonify({"message":"Tabla de usuarios creada correctamente."}), 200
    else:
        return jsonify({"error":"No se pudo crear la tabla de usuarios."}), 400
    
@inicialize_bp.route('/car_table', methods=['POST'])
def create_cars_table():
    if tables_repo.create_car_table():
        return jsonify({"message":"Tabla de autos creada correctamente."}), 200
    else:
        return jsonify({"error":"No se pudo crear la tabla de autos."}), 400

@inicialize_bp.route('/rental_table', methods=['POST'])
def create_rentals_table():
    if tables_repo.create_rental_table():
        return jsonify({"message":"Tabla de rentas creada correctamente."}), 200
    else:
        return jsonify({"error":"No se pudo crear la tabla de rentas."}), 400