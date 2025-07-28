from flask import Blueprint, request, jsonify
from repositories.car_repository import CarRepository
from db.db_manager import db_manager

car_bp = Blueprint('car_bp', __name__)
car_repo = CarRepository()

@car_bp.route('/cars', methods=['POST'])
def create_car():
    data = request.get_json()
    if not data or not all(key in data for key in ('make', 'model', 'year', 'car_status')):
        return jsonify({"error": "Faltan campos por llenar"}), 400
    
    make = data['make']
    model = data['model']
    year = data['year']
    car_status = data['car_status']

    try:
        if car_repo.create_car(make, model, year, car_status):
            return jsonify({"message": "Auto creado correctamente."}), 201
        else:
            return jsonify({"error": "No se pudo crear el auto"}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@car_bp.route('/cars/<int:car_id>', methods=['PUT'])
def update_car_status(car_id):
    data = request.get_json()
    if not data or 'car_status' not in data:
        return jsonify({"error": "Falta el campo car_status"}), 400
    
    new_status = data['car_status']
    valid_statuses = {"rented", "available"}

    if new_status not in valid_statuses:
        return jsonify({"error": "Estado inválido."}), 400
    
    try:
        if car_repo.update_car_status(car_id, new_status):
            return jsonify({"error": "Estado del auto actualizado correctamente."}), 200
        else:
            return jsonify({"error": "No se pudo actualizar el estado del auto."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@car_bp.route('/cars', methods=['GET'])
def get_cars():
    try:
        filtered_cars = car_repo.get_all_cars()
        id_filter = request.args.get('id')
        make_filter = request.args.get('make')
        model_filter = request.args.get('model')
        year_filter = request.args.get('year')
        status_filter = request.args.get('car_status')

        if filtered_cars:
            if id_filter:
                filtered_cars = [car for car in filtered_cars if str(car['id']) == id_filter]
            if make_filter:
                filtered_cars = [car for car in filtered_cars if car['make'] == make_filter] 
            if model_filter:
                filtered_cars = [car for car in filtered_cars if car['model'] == model_filter]
            if year_filter:
                filtered_cars = [car for car in filtered_cars if str(car['year']) == year_filter]
            if status_filter:
                filtered_cars = [car for car in filtered_cars if car['car_status'] == status_filter]
        if not filtered_cars:
            return jsonify({"message": "No se encontraron autos."}), 404
        
        return jsonify(filtered_cars), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

        