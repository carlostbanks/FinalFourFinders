import requests
import json

# Cache for school popularity data
school_popularity_cache = {}

def get_school_enrollment_data(school_name):
    """
    Get enrollment data for a school using the College Scorecard API
    """
    # Check cache first
    if school_name.lower() in school_popularity_cache:
        return school_popularity_cache[school_name.lower()]
    
    api_key = '76g5lrphHngbvOw6deHB5Oj40cRdqx2zvwDeY1pt'
    base_url = 'https://api.data.gov/ed/collegescorecard/v1/schools'
    
    # Make API request
    try:
        response = requests.get(
            base_url,
            params={
                'api_key': api_key,
                'school.name': school_name,
                'fields': 'id,school.name,latest.student.size'
            }
        )
        
        # Check if response is successful
        if response.status_code != 200:
            print(f"Error fetching enrollment data: {response.status_code}")
            return {
                'enrollment': 0,
                'found': False,
                'message': f'API error: {response.status_code}'
            }
        
        data = response.json()
        
        # If no results, return empty data
        if data['metadata']['total'] == 0:
            return {
                'enrollment': 0,
                'found': False,
                'message': 'No schools found'
            }
        
        # Find the best match
        best_match = None
        max_enrollment = 0
        total_enrollment = 0
        school_count = 0
        
        for school in data['results']:
            enrollment = school.get('latest.student.size', 0)
            
            # Some values might be null, handle those
            if enrollment is None:
                enrollment = 0
                
            total_enrollment += enrollment
            
            if enrollment > 0:
                school_count += 1
            
            # Keep track of the school with the highest enrollment
            if enrollment > max_enrollment:
                max_enrollment = enrollment
                best_match = {
                    'school_name': school.get('school.name', ''),
                    'enrollment': enrollment,
                    'school_id': school.get('id', '')
                }
        
        # Calculate average enrollment excluding schools with 0 or null
        avg_enrollment = total_enrollment / school_count if school_count > 0 else 0
        
        result = {
            'enrollment': max_enrollment,  # Use the highest enrollment as the primary metric
            'average_enrollment': avg_enrollment,
            'total_enrollment': total_enrollment,
            'found': best_match is not None,
            'school_details': best_match,
            'school_count': data['metadata']['total']
        }
        
        # Cache the result
        school_popularity_cache[school_name.lower()] = result
        
        return result
        
    except Exception as e:
        print(f"Error getting enrollment data: {e}")
        return {
            'enrollment': 0,
            'found': False,
            'message': f'Error: {str(e)}'
        }