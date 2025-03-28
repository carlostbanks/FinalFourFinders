# In app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from .models.db import init_db

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    CORS(app)
    
    # Configure from environment variables
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///finalfourfinders.db')
    print(f"Configured database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    
    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'ok'}, 200
    
    return app