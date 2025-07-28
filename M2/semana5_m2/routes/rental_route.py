from flask import Blueprint, request, jsonify
from repositories.car_repository import CarRepository
from repositories.user_repository import UserRepository
from repositories.rentals_repository import RentalsRepository
from db.db_manager import db_manager

rental_bp = Blueprint('rental_bp', __name__)
car_repo = CarRepository()
user_repo = UserRepository()
rental_repo = RentalsRepository(car_repo, user_repo)

@rental_bp.route('/rentals', methods=['POST'])
def create_rentals():
    data = request.get_json()
    if not data or not all(key in data for key in ('user_id', 'car_id', 'rental_date', 'rental_status')):
        return jsonify({"error": "Faltan campos por llenar"}), 400
    
    user_id = data['user_id']
    car_id = data['car_id']
    rental_date = data['rental_date']
    rental_status = data['rental_status']

    try:
        if rental_repo.create_rental(user_id, car_id, rental_date, rental_status):
            return jsonify({"message": "Renta creada correctamente."}), 201
        else: 
            return jsonify({"error": "No se pudo crear la renta."}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@rental_bp.route('/rentals/<int:rental_id>', methods=['PUT'])
def update_rentals_status(rental_id):
    data = request.get_json()
    if not data or 'rental_status' not in data:
        return jsonify({"error": "Faltan los datos a actualizar"}), 400
    
    new_status = data['rental_status']
    valid_statuses = {"overdue", "in time", "returned"}

    if new_status not in valid_statuses:
        return jsonify({"error": "Estado inválido."}), 400
    
    try:
        if rental_repo.update_rental_status(rental_id, new_status):
            return jsonify({"error": "Estado del alquiler actualizado correctamente."}), 200
        else:
            return jsonify({"error": "No se pudo actualizar el estado del alquiler."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@rental_bp.route('/rentals', methods=['GET'])
def get_rentals():
    try:
        filtered_rentals = rental_repo.get_all_rentals()
        id_filter = request.args.get('id')
        user_id_filter = request.args.get('user_id')
        car_id_filter = request.args.get('car_id')
        rental_date_filter = request.args.get('rental_date')
        rental_status_filter = request.args.get('rental_status')

        if filtered_rentals:
            if id_filter:
                filtered_rentals = [car for car in filtered_rentals if str(car['id']) == id_filter]
            if user_id_filter:
                filtered_rentals = [car for car in filtered_rentals if car['user_id'] == user_id_filter] 
            if car_id_filter:
                filtered_rentals = [car for car in filtered_rentals if car['car_id'] == car_id_filter]
            if rental_date_filter:
                filtered_rentals = [car for car in filtered_rentals if str(car['rental_date']) == rental_date_filter]
            if rental_status_filter:
                filtered_rentals = [car for car in filtered_rentals if car['rental_status'] == rental_status_filter]
        if not filtered_rentals:
            return jsonify({"message": "No se encontraron alquileres."}), 404
        
        return jsonify(filtered_rentals), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
            