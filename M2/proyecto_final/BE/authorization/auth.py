import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import request, jsonify
from BE.authorization.jwt_manager import JWTManager

jwt_manager = JWTManager('trespatitos', 'HS256')

def require_auth(func):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'token missing'}), 401
        try:
            decoded = jwt_manager.decode(token.replace("Bearer ", ""))
            request.user = decoded
        except Exception:
            return jsonify({'error': 'invalid token'}), 401
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

def require_role(required_role):
    def decorator(func):
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'error': 'token missing'}), 401
            try:
                decoded = jwt_manager.decode(token.replace("Bearer ", ""))
                if decoded.get('role') != required_role:
                    return jsonify({'error': 'access denied'}), 403
                request.user = decoded
            except Exception:
                return jsonify({'error': 'invalid token'}), 401
            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator