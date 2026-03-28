from variables import SECRET_KEY, JWT_ALGORITHM
from flask import request, jsonify
from jwt import ExpiredSignatureError
from auth.jwt_manager import JWTManager

jwt_manager = JWTManager(SECRET_KEY, JWT_ALGORITHM)

def require_auth(func):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'token missing'}), 401
        try:
            decoded = jwt_manager.decode(token.replace("Bearer ", ""))
            request.user = decoded
            request.user_id = decoded.get('id')
        except ExpiredSignatureError:
            return jsonify({'error': 'token expired'}), 401
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
            except ExpiredSignatureError:
                return jsonify({'error': 'token expired'}), 401
            except Exception:
                return jsonify({'error': 'invalid token'}), 401
            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator