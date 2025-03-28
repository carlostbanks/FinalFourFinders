from datetime import datetime
from .db import db
import json

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Store lists as JSON strings in the database
    candidate_teams = db.Column(db.Text, nullable=False)  # JSON array of team objects
    recommended_teams = db.Column(db.Text, nullable=False)  # JSON array of top 4 team objects
    
    # Relationship with User model
    user = db.relationship('User', backref=db.backref('recommendations', lazy=True))
    
    def __init__(self, user_id, title, candidate_teams, recommended_teams):
        self.user_id = user_id
        self.title = title
        
        # Store lists as JSON strings
        self.candidate_teams = json.dumps(candidate_teams)
        self.recommended_teams = json.dumps(recommended_teams)
    
    def to_dict(self):
        """Convert recommendation to dictionary for API responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'created_at': self.created_at.isoformat(),
            'candidate_teams': json.loads(self.candidate_teams),
            'recommended_teams': json.loads(self.recommended_teams)
        }