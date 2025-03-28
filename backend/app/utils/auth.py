import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from ..models.user import User

def generate_token(user_id):
    """Generate a JWT token for the user"""
    payload = {
        'exp': datetime.utcnow() + timedelta(seconds=int(os.environ.get('JWT_EXPIRATION_DELTA', 86400))),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        os.environ.get('JWT_SECRET_KEY', 'default-dev-key'),
        algorithm='HS256'
    )

def decode_token(token):
    """Decode a JWT token"""
    try:
        payload = jwt.decode(
            token,
            os.environ.get('JWT_SECRET_KEY', 'default-dev-key'),
            algorithms=['HS256']
        )
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

def token_required(f):
    """Decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        user_id = decode_token(token)
        if not user_id:
            return jsonify({'message': 'Token is invalid or expired'}), 401
        
        # Add user to request context
        request.user_id = user_id
        return f(*args, **kwargs)
    
    return decorated