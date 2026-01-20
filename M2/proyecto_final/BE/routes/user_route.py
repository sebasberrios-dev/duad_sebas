import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify, Blueprint
from BE.repositories.users_repo import UsersRepository
from BE.authorization.jwt_manager import JWTManager
from BE.authorization.auth import require_auth, require_role 
from BE.utils.controller import Controller


user_route = Blueprint("user_route", __name__)
users_repo = UsersRepository()
jwt_manager = JWTManager("trespatitos", "HS256")
controller = Controller()

# Endpoint de verificación de estado del servidor
@user_route.route("/liveness")
def liveness():
    return "<p>Hello, World!</p>"

# Registra un nuevo usuario y devuelve un token JWT
@user_route.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "player") 

    if not username or not email or not password:
        return jsonify({"error": "data missing for registration"}), 400
    
    if role not in ["player", "dm", "admin"]:
        return jsonify({"error": "invalid role"}), 400
    
    if users_repo.read(username=username, password=password):
        return jsonify({"error": "user already exists"}), 409
    
    result = users_repo.create(username, email, password, role)

    user_id = result[0]
    token = jwt_manager.encode({"id": user_id, "role": role})

    return jsonify({"message": "User registered successfully", "token": token, "user_id": user_id, "role": role, "username": username}), 201

# Autentica un usuario y devuelve un token JWT
@user_route.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "data missing for login"}), 400
    
    result = users_repo.read(username=username, password=password)

    if result is None:
        return jsonify({"error": "invalid credentials"}), 401
    
    user_id = result["id"]
    user_role = result["role"]

    token = jwt_manager.encode({"id": user_id, "role": user_role})

    return jsonify({"message": "Login successful", "token": token, "user_id": user_id, "role": user_role, "username": result["username"]}), 200

# Actualiza la información de un usuario (propio o admin)
@user_route.route("/user/update/<int:user_id>", methods=["PUT"])
@require_auth
def update_user(user_id):
    try:
        # Verificar que el usuario actualiza su propia información o es admin
        current_user_id = request.user.get("id")
        current_user_role = request.user.get("role")
        
        if current_user_id != user_id and current_user_role != "admin":
            return jsonify({"error": "Unauthorized to update this user"}), 403
        
        data = request.get_json()
        updated_fields = {k: v for k, v in data.items() if v is not None}

        if not updated_fields:
            return jsonify({"error": "no fields to update"}), 400
        
        users_repo.update(user_id, **updated_fields)
        return jsonify({"message": f"User {user_id} updated successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Elimina un usuario del sistema (solo admins)
@user_route.route("/user/delete/<int:user_id>", methods=["DELETE"])
@require_role("admin")
def delete_user(user_id):
    if users_repo.delete(user_id):
        return jsonify({"message": f"User {user_id} deleted successfully"}), 200
    else:
        return jsonify({"error": "user not found"}), 404
    
# Obtiene la información del usuario autenticado
@user_route.route("/me", methods=["GET"])
@require_auth
def me():
    try:
        user_id = request.user["id"]
        user = users_repo.read_by_id(user_id)

        if user is None:
            return jsonify({"error": "user not found"}), 404
        
        user_data = controller.serialize_row(user)
        return jsonify(user_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500




