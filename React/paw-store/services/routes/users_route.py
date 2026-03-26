import bcrypt
from flask import request, jsonify, Blueprint
from auth.jwt_manager import JWTManager
from repositories.users_repo import UserRepository 

users_bp = Blueprint('users', __name__)
user_repo = UserRepository()
jwt_manager = JWTManager('trespatitos', 'HS256')

@users_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'client') 

        if not full_name or not email or not password:
            return jsonify({ 'error': 'missing fields' }), 401
    
        if user_repo.read_by_email(email=email):
            return jsonify({ 'error': 'email already exists' }), 409
        
        if role not in ['client', 'admin']:
            return jsonify({ 'error': 'invalid role' }), 400
        
        user = user_repo.create(full_name, email, password, role)

        if user:
            token = jwt_manager.encode({'id': int(user.id), 'role': role})
            return jsonify({ 'message': 'user created', 'token': token }), 201
        
        else:
            raise Exception("User creation failed")
        
    except Exception as e:
        print(f"Error in registration: {e}")
        return jsonify({ 'error': 'registration failed' }), 500
    

@users_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({ 'error': 'missing fields' }), 401
        
        
        user = user_repo.read_by_email(email=email)

        if not user:
            return jsonify({ 'error': 'invalid credentials' }), 401

        ok = bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8'))

        if not ok:
            return jsonify({ 'error': 'invalid credentials' }), 401
        
        token = jwt_manager.encode({'id': int(user['id']), 'role': user['role']})
        return jsonify({ 'message': 'login successful', 'token': token }), 200
    
    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({ 'error': 'login failed' }), 500
    

