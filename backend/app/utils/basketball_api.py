# app/utils/basketball_api.py
import requests
import os
import time

# API configuration
API_URL = "https://v1.basketball.api-sports.io"
API_KEY = "482ffa2596fa599bf70a212fc2144b3e"  # Consider moving this to environment variables

# Cache for teams list to reduce API calls
ncaa_teams_cache = {}
team_stats_cache = {}

def get_ncaa_teams(season="2023-2024"):
    """
    Get all NCAA teams for a specific season
    """
    # Check cache first
    cache_key = f"ncaa_teams_{season}"
    if cache_key in ncaa_teams_cache:
        return ncaa_teams_cache[cache_key]

    # Prepare headers
    headers = {
        'x-apisports-key': API_KEY
    }

    # Make API request
    response = requests.get(
        f"{API_URL}/teams",
        headers=headers,
        params={
            'league': 116,  # NCAA
            'season': season
        }
    )

    # Check if response is successful
    if response.status_code != 200:
        return []

    data = response.json()
    
    # If no results, return empty list
    if data['results'] == 0:
        return []
        
    # Cache the result
    ncaa_teams_cache[cache_key] = data['response']
    
    return data['response']

def find_team_by_name(team_name, season="2023-2024"):
    """
    Find a team by name from the NCAA teams list
    Returns None if not found
    """
    teams = get_ncaa_teams(season)
    
    # Normalize the search name
    search_name = team_name.lower().strip()
    
    # First try exact match
    for team in teams:
        if team['name'].lower() == search_name:
            return team
    
    # Then try contains match
    for team in teams:
        if search_name in team['name'].lower():
            return team
    
    # Then try more flexible matching
    for team in teams:
        # Handle cases like "North Carolina" vs "UNC"
        if (("north carolina" in search_name or "unc" in search_name) and 
            ("north carolina" in team['name'].lower() or "unc" in team['name'].lower())):
            return team
            
        # Handle cases like "Southern California" vs "USC"
        if (("southern california" in search_name or "usc" in search_name) and 
            ("southern california" in team['name'].lower() or "usc" in team['name'].lower())):
            return team
    
    return None

def get_team_statistics(team_id, season, league=116):
    """
    Get team statistics for a specific season
    Returns None if not found
    """
    # Check cache first
    cache_key = f"stats_{team_id}_{season}"
    if cache_key in team_stats_cache:
        return team_stats_cache[cache_key]
        
    # Prepare headers
    headers = {
        'x-apisports-key': API_KEY
    }

    # Make API request
    response = requests.get(
        f"{API_URL}/statistics",
        headers=headers,
        params={
            'league': league,
            'season': season,
            'team': team_id
        }
    )

    # Check if response is successful
    if response.status_code != 200:
        return None

    data = response.json()
    
    # If no results, return None
    if data['results'] == 0:
        return None
    
    # Cache the result
    team_stats_cache[cache_key] = data['response']
        
    return data['response']

def get_multi_season_stats(team_id, seasons=["2021-2022", "2022-2023", "2023-2024"]):
    """
    Get statistics for multiple seasons and calculate averages
    """
    all_stats = []
    
    for season in seasons:
        stats = get_team_statistics(team_id, season)
        if stats:
            all_stats.append(stats)
    
    if not all_stats:
        return None
    
    # Calculate average statistics
    avg_win_pct = sum(float(stats['games']['wins']['all']['percentage']) for stats in all_stats) / len(all_stats)
    avg_points_for = sum(float(stats['points']['for']['average']['all']) for stats in all_stats) / len(all_stats)
    avg_points_against = sum(float(stats['points']['against']['average']['all']) for stats in all_stats) / len(all_stats)
    
    # Create a summary object
    summary = {
        'team': all_stats[0]['team'],  # Use the team info from the first season
        'seasons_analyzed': len(all_stats),
        'available_seasons': [stats['league']['season'] for stats in all_stats],
        'avg_win_percentage': avg_win_pct,
        'avg_points_for': avg_points_for,
        'avg_points_against': avg_points_against,
        'point_differential': avg_points_for - avg_points_against
    }
    
    return summary