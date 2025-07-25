from flask import Blueprint, request, jsonify
from repositories.user_repository import UserRepository
from db.db_manager import db_manager

user_bp = Blueprint('user_bp', __name__)
user_repo = UserRepository()

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or not all(key in data for key in ('full_name', 'email', 'username', 'password',  'birthdate', 'user_status')):
        return jsonify({"error": "Faltan campos por llenar"}), 400
    
    name = data['full_name']
    email = data['email']
    username = data['username']
    password = data['password']
    birthdate = data['birthdate']
    user_status = data['user_status']

    try:
        if user_repo.create_user(name, email, username, password, birthdate, user_status):
            return jsonify({"message": "Usuario creado correctamente."}), 201
        else:
            return jsonify({"error": "No se pudo crear usuario"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    if not data or 'user_status' not in data:
        return jsonify({"error": "Falta el campo user_status"}), 400

    new_status = data['user_status']
    valid_statuses = {"per day", "defaulter"}

    if new_status not in valid_statuses:
        return jsonify({"error": "Estado inválido."}), 400

    try:
        if user_repo.update_user_status(user_id, new_status):
            return jsonify({"message": "Estado del usuario actualizado correctamente."}), 200
        else:
            return jsonify({"error": "Usuario no encontrado o sin cambios."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        filtered_users = user_repo.get_all_users()
        id_filter = request.args.get('id')
        full_name_filter = request.args.get('full_name')
        email_filter = request.args.get('email')
        username_filter = request.args.get('username')
        birthdate_filter = request.args.get('birthdate')
        user_status_filter = request.args.get('user_status')
        if filtered_users:
            if id_filter:
                filtered_users = [user for user in filtered_users if str(user['id']) == id_filter]
            if full_name_filter:
                filtered_users = [user for user in filtered_users if user['full_name'] == full_name_filter]
            if email_filter:
                filtered_users = [user for user in filtered_users if user['email'] == email_filter]
            if username_filter:
                filtered_users = [user for user in filtered_users if user['username'] == username_filter]
            if birthdate_filter:
                filtered_users = [user for user in filtered_users if str(user['birthdate']) == birthdate_filter]
            if user_status_filter:
                filtered_users = [user for user in filtered_users if user['user_status'] == user_status_filter]
        if not filtered_users:
            return jsonify({"message": "No se encontraron usuarios"}), 404
        
        return jsonify(filtered_users), 200
        
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



