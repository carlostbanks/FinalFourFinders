from flask import Blueprint
from ..controllers.recommendations import create_recommendation, get_user_recommendations, get_recommendation, delete_recommendation
from ..utils.auth import token_required

# Create a blueprint for recommendations
recommendations_bp = Blueprint('recommendations', __name__, url_prefix='/api')

# Recommendation routes
recommendations_bp.route('/recommendations', methods=['POST'])(token_required(create_recommendation))
recommendations_bp.route('/recommendations', methods=['GET'])(token_required(get_user_recommendations))
recommendations_bp.route('/recommendations/<int:recommendation_id>', methods=['GET'])(token_required(get_recommendation))
recommendations_bp.route('/recommendations/<int:recommendation_id>', methods=['DELETE'])(token_required(delete_recommendation))