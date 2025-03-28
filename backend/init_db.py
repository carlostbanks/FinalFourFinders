from app import create_app
from app.models.db import db
from app.models.user import User
from dotenv import load_dotenv
import os

def init_database():
    """Initialize the database"""
    # Load environment variables
    load_dotenv()
    
    # Debug - print environment variables
    print(f"Environment variables:")
    print(f"DATABASE_URL: {os.environ.get('DATABASE_URL')}")
    
    app = create_app()
    with app.app_context():
        # Print detailed connection info
        print(f"Database URL in app config: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print(f"Engine: {db.engine}")
        
        # Create tables
        db.drop_all()  # Drop existing tables first to ensure a clean state
        db.create_all()
        print("Database initialized!")
        
        # Verify tables were created
        from sqlalchemy import inspect, text
        inspector = inspect(db.engine)
        print(f"Actual tables in database: {inspector.get_table_names()}")

if __name__ == '__main__':
    init_database()