from ..models.db import db
from ..models.user import User
from ..models.recommendation import Recommendation
from flask import current_app

def ensure_tables_exist():
    """
    Ensure all database tables exist
    This is called on application startup
    """
    with current_app.app_context():
        try:
            # Make sure all models are imported before creating tables
            print("Models loaded:", [User.__name__, Recommendation.__name__])
            
            # Create all tables
            db.create_all()
            print("Database tables verified/created!")
            
            # List all tables to verify
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"Tables in database: {tables}")
        except Exception as e:
            print(f"Error initializing database: {e}")