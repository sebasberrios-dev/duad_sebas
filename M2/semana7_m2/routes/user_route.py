from repositories.users_repository import UserRepository
from jwt_manager import JWTManager
from flask import request, Response, jsonify, Blueprint
from authorization import require_auth


user_bp = Blueprint('user_bp', __name__)
user_repo = UserRepository()
jwt_manager = JWTManager('trespatitos', 'HS256')


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
        user = user_repo.read_by_id(user_id)
        user_dict = {
            'id': user[0],
            'username': user[1],
            'role': user[3]
        }
        return jsonify(id=user_dict['id'], username=user_dict['username'], role=user_dict['role'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500