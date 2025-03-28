from ..models.db import db
from flask import current_app

def ensure_tables_exist():
    """
    Ensure all database tables exist
    This is called on application startup
    """
    with current_app.app_context():
        try:
            # Check if tables need to be created
            db.create_all()
            print("Database tables verified/created!")
        except Exception as e:
            print(f"Error initializing database: {e}")