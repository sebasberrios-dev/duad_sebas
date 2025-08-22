from repositories.users_repository import UserRepository
from jwt_manager import JWTManager
from flask import request, Response, jsonify, Blueprint
from authorization import require_auth
from cache.cache_manager import CacheManager
import json


user_bp = Blueprint('user_bp', __name__)
user_repo = UserRepository()
jwt_manager = JWTManager('trespatitos', 'HS256')
cache_manager = CacheManager(host="redis-18528.c92.us-east-1-3.ec2.redns.redis-cloud.com", 
                             port=18528, 
                             password="sKSyD3t1MqdmhCBmuF6LRZOuvV46BSfR")

@user_bp.route("/liveness")
def liveness():
    return "<p>Hello, World!</p>"

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')  # por defecto 'user'

    if not username or not password:
        return jsonify({"error": "Faltan datos para el registro"}), 400
    if user_repo.read(username=username, password=password):
        return jsonify({"error": "El usuario ya existe"}), 409
    if role not in ['admin', 'user']:
        return jsonify({"error": "Rol no válido"}), 400
    
    result = user_repo.create(username, password, role)
    user_id = result[0]

    token = jwt_manager.encode({'id': user_id, 'role': role})
    return jsonify(token=token)

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Faltan datos para el inicio de sesión"}), 400

    result = user_repo.read(username=username, password=password)

    if result is None:
        return jsonify({"error": "Credenciales inválidas"}), 403

    user = result[0] 
    user_id = user['id']
    user_role = user['role']

    token = jwt_manager.encode({'id': user_id, 'role': user_role})
    return jsonify(token=token)


@user_bp.route('/me')
@require_auth
def me():
    try:
        user_id = request.user['id']
        cache_key = f"user_{user_id}_me"
        cached_data = cache_manager.get_data(cache_key)
        if cached_data:
            return jsonify(json.loads(cached_data)), 201

        user = user_repo.read_by_id(user_id)
        user_data = dict(id=user['id'], username=user['username'], role=user['role'])

        cache_manager.store_data(cache_key, json.dumps(user_data, default=str), expiration=300)
        return jsonify(user_data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
