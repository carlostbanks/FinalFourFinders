# app/controllers/recommendations.py
from flask import request, jsonify
import json
from ..models.db import db
from ..models.recommendation import Recommendation
from ..utils.basketball_api import find_team_by_name, get_multi_season_stats

def create_recommendation():
    """Create a new recommendation based on candidate teams"""
    data = request.get_json()
    user_id = request.user_id  # Set by token_required decorator
    
    # Check if the data is just an array of team names
    if isinstance(data, list):
        candidate_teams = data
        title = "Tournament Picks"  # Default title
    else:
        # Otherwise, expect the standard format with title and candidate_teams
        if 'candidate_teams' not in data:
            return jsonify({'error': 'Missing required field: candidate_teams'}), 400
        
        candidate_teams = data['candidate_teams']
        title = data.get('title', 'Tournament Picks')  # Use provided title or default
    
    # Validate that candidate_teams is a list
    if not isinstance(candidate_teams, list):
        return jsonify({'error': 'candidate_teams must be a list'}), 400
    
    # Validate that there are enough teams (at least 4)
    if len(candidate_teams) < 4:
        return jsonify({'error': 'At least 4 candidate teams are required'}), 400
    
    # Process each team to get ratings
    processed_teams = []
    for team_name in candidate_teams:
        # Find the team in NCAA database
        team_data = find_team_by_name(team_name)
        if not team_data:
            # If team not found, add with rating of 0
            processed_teams.append({
                'name': team_name,
                'found': False,
                'rating': 0,
                'message': 'Team not found in NCAA database'
            })
            continue
            
        # Get team statistics across multiple seasons
        team_id = team_data['id']
        multi_stats = get_multi_season_stats(team_id)
        
        if not multi_stats:
            # If stats not found for any season, add with rating of 0
            processed_teams.append({
                'name': team_name,
                'found': True,
                'rating': 0,
                'message': 'Statistics not available for recent seasons',
                'team_id': team_id,
                'team_name': team_data['name'],
                'team_logo': team_data.get('logo')
            })
            continue
            
        # Calculate rating based on win percentage
        rating = multi_stats['avg_win_percentage'] * 100  # Convert to 0-100 scale
        
        processed_teams.append({
            'name': team_name,
            'found': True,
            'rating': rating,
            'avg_win_percentage': multi_stats['avg_win_percentage'],
            'avg_points_for': multi_stats['avg_points_for'],
            'avg_points_against': multi_stats['avg_points_against'],
            'point_differential': multi_stats['point_differential'],
            'seasons_analyzed': multi_stats['seasons_analyzed'],
            'team_id': team_id,
            'team_name': team_data['name'],
            'team_logo': team_data.get('logo')
        })
    
    # Sort teams by rating (highest first)
    processed_teams.sort(key=lambda x: x['rating'], reverse=True)
    
    # Select top 4 teams (or fewer if not enough teams found)
    recommended_teams = processed_teams[:4]
    
    try:
        # Create the recommendation
        new_recommendation = Recommendation(
            user_id=user_id,
            title=title,
            candidate_teams=processed_teams,
            recommended_teams=recommended_teams
        )
        
        db.session.add(new_recommendation)
        db.session.commit()
        
        return jsonify({
            'message': 'Recommendation created successfully',
            'recommendation': new_recommendation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
# Add these functions to your existing recommendations.py file

def get_user_recommendations():
    """Get all recommendations for the current user"""
    user_id = request.user_id  # Set by token_required decorator
    
    recommendations = Recommendation.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'recommendations': [rec.to_dict() for rec in recommendations]
    }), 200

def get_recommendation(recommendation_id):
    """Get a specific recommendation by ID"""
    user_id = request.user_id  # Set by token_required decorator
    
    recommendation = Recommendation.query.filter_by(id=recommendation_id).first()
    
    if not recommendation:
        return jsonify({'error': 'Recommendation not found'}), 404
    
    # Check if the user has permission to access this recommendation
    if recommendation.user_id != user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    return jsonify({
        'recommendation': recommendation.to_dict()
    }), 200

def delete_recommendation(recommendation_id):
    """Delete a recommendation"""
    user_id = request.user_id  # Set by token_required decorator
    
    recommendation = Recommendation.query.filter_by(id=recommendation_id).first()
    
    if not recommendation:
        return jsonify({'error': 'Recommendation not found'}), 404
    
    # Check if the user has permission to delete this recommendation
    if recommendation.user_id != user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    try:
        db.session.delete(recommendation)
        db.session.commit()
        return jsonify({
            'message': 'Recommendation deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500