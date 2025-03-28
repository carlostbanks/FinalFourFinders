from flask import Blueprint, request, jsonify
from ..controllers.auth import register, login, get_user
from ..utils.auth import token_required
from ..models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

# Auth routes
auth_bp.route('/auth/register', methods=['POST'])(register)
auth_bp.route('/auth/login', methods=['POST'])(login)
auth_bp.route('/auth/me', methods=['GET'])(token_required(get_user))

# Test protected route
@auth_bp.route('/test/protected', methods=['GET'])
@token_required
def protected_test():
    """A test endpoint that is only accessible with a valid JWT token"""
    user_id = request.user_id
    
    return jsonify({
        'message': 'This is a protected endpoint!',
        'user_id': user_id,
        'secret_data': 'Only authenticated users can see this data.'
    }), 200

@auth_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    """Admin endpoint to get all users - in a real app, this would need proper admin authentication"""
    users = User.query.all()
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200