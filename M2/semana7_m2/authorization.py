from flask import request, jsonify
from jwt_manager import JWTManager

jwt_manager = JWTManager('trespatitos', 'HS256')

def require_auth(func):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'falta token'}), 401
        try:
            decoded = jwt_manager.decode(token.replace("Bearer ", ""))
            request.user = decoded
        except Exception:
            return jsonify({'error': 'token inválido'}), 401
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

def require_role(required_role):
    def decorator(func):
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'error': 'falta token'}), 401
            try:
                decoded = jwt_manager.decode(token.replace("Bearer ", ""))
                if decoded.get('role') != required_role:
                    return jsonify({'error': 'acceso denegado'}), 403
                request.user = decoded
            except Exception:
                return jsonify({'error': 'token inválido'}), 401
            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator