from flask import request, jsonify, Blueprint
from authorization.jwt_manager import JWTManager
from authorization.auth import require_auth, require_role
from repositories.user_repository import UserRepository
from cache.cache_manager import CacheManager

user_bp = Blueprint('user_bp', __name__)
user_repo = UserRepository()
jwt_manager = JWTManager('trespatitos', 'HS256')
cache_manager = CacheManager("PLACEHOLDER_FOR_REDIS_URL")

@user_bp.route("/liveness")
def liveness():
    return "<p>Hello, World!</p>"

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'costumer') # por defecto 'costumer'

    if not username or not email or not password:
        return jsonify({"error": "data missing for registration"}), 400
    if role not in ['admin', 'costumer']:
        return jsonify({"error": "invalid role"}), 400
    if user_repo.read(username=username, password=password):
        return jsonify({"error": "user already exists"}), 409
    

    result = user_repo.create(username, email, password, role)
    user_id = result[0]
    token = jwt_manager.encode({'id': user_id, 'role': role})
    return jsonify(token=token)

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "data missing for login"}), 400
    
    result = user_repo.read(username=username, password=password)
    if result is None:
        return jsonify({"error": "invalid credentials"}), 403
    
    user = result[0]
    user_id = user['id']
    user_role = user['role']
    token = jwt_manager.encode({'id': user_id, 'role': user_role})
    return jsonify(token=token)

@user_bp.route('/delete/<int:user_id>', methods=['DELETE'])
@require_role('admin')
def delete_user(user_id):
    if user_repo.delete(user_id):
        return jsonify({"message": f"User {user_id} deleted successfully"}), 200
    else:
        return jsonify({"error": "user not found"}), 404

@user_bp.route('/me')
@require_auth
def me():
    try:
        user_id = request.user['id']
        def query_db():
            user = user_repo.read_by_id(user_id)
            if user:
                return dict(user)
            return None
        user_data = cache_manager.cache_or_query(f"user:{user_id}", query_db, expiration=120)
        if user_data is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500