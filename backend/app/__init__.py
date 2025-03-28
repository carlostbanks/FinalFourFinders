# In app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from .models.db import init_db, db  # Add db import here

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
    
    # Ensure all database tables exist
    with app.app_context():
        # Import models explicitly to make sure they're registered with SQLAlchemy
        from .models.user import User
        from .models.recommendation import Recommendation
        
        # Create all tables
        db.create_all()
        print("Database tables created during app initialization")
    
    # Register blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    
    # Register recommendation blueprint
    from .routes.recommendations import recommendations_bp
    app.register_blueprint(recommendations_bp)
    
    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'ok'}, 200
    
    return app