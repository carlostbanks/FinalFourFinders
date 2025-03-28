from app import create_app
from app.models.db import db

def init_database():
    """Initialize the database"""
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Database initialized!")

if __name__ == '__main__':
    init_database()