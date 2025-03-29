import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card, Button, Badge, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Team {
  name: string;
  team_name?: string;
  team_logo?: string;
  rating?: number;
  avg_win_percentage?: number;
  enrollment?: number;
}

interface Recommendation {
  id: number;
  title: string;
  created_at: string;
  recommended_teams: Team[];
  candidate_teams: Team[];
  recommendation_type?: string;
}

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to be logged in to view recommendations');
          setLoading(false);
          return;
        }

        const response = await fetch('https://finalfourfinders-api.onrender.com/api/recommendations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        const sortedRecommendations = (data.recommendations || []).sort((a: Recommendation, b: Recommendation) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setRecommendations(sortedRecommendations);
      } catch (err) {
        setError('Error fetching recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Function to determine if a recommendation is performance or popularity based
  const getRecommendationType = (rec: Recommendation): 'performance' | 'popularity' => {
    if (rec.recommendation_type === 'popularity') return 'popularity';
    if (rec.recommendation_type === 'performance') return 'performance';
    
    // If type isn't explicitly set, try to infer from the data
    if (rec.recommended_teams.some(team => typeof team.enrollment === 'number')) {
      return 'popularity';
    }
    return 'performance'; // Default to performance
  };

  // Group recommendations into pairs (every 2 recommendations = 1 pair)
  const groupRecommendations = () => {
    // First, separate recommendations by type
    const performanceRecs = recommendations.filter(rec => 
      getRecommendationType(rec) === 'performance'
    );
    
    const popularityRecs = recommendations.filter(rec => 
      getRecommendationType(rec) === 'popularity'
    );
    
    // Create pairs based on the maximum length
    const maxLength = Math.max(performanceRecs.length, popularityRecs.length);
    const pairs = [];
    
    for (let i = 0; i < maxLength; i++) {
      pairs.push({
        performance: performanceRecs[i] || null,
        popularity: popularityRecs[i] || null,
        index: i
      });
    }
    
    return pairs;
  };

  const recommendationPairs = groupRecommendations();

  if (loading) {
    return (
      <div className="recommendations-container">
        <Navbar />
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <Navbar />
        <div className="text-center p-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Button color="primary" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <Navbar />
      <div className="container py-4">
        <h2 className="text-center mb-4">Your Saved Recommendations</h2>
        
        {recommendations.length === 0 ? (
          <div className="text-center p-5 bg-light rounded">
            <p>You haven't created any recommendations yet.</p>
            <Button color="primary" onClick={() => navigate('/home')}>
              Create Recommendations
            </Button>
          </div>
        ) : (
          <div>
            {recommendationPairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" 
                       style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                    {pairIndex + 1}
                  </div>
                  <h4 className="ms-3 mb-0">Recommendation #{pairIndex + 1}</h4>
                  <Badge color="secondary" className="ms-3">
                    {formatDate((pair.performance || pair.popularity)?.created_at || new Date().toISOString())}
                  </Badge>
                </div>
                
                <Row>
                  {/* Performance Card */}
                  <Col md={6} className="mb-3">
                    {pair.performance ? (
                      <Card className="h-100 shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Performance Rankings</h5>
                          <Badge color="light" className="text-primary">Performance</Badge>
                        </div>
                        <div className="card-body">
                          <h6 className="border-bottom pb-2 mb-3">Top 4 Teams</h6>
                          <div className="row">
                            {pair.performance.recommended_teams.map((team, idx) => (
                              <div className="col-md-6 mb-2" key={idx}>
                                <div className="d-flex align-items-center p-2 bg-light rounded">
                                  {team.team_logo && (
                                    <img
                                      src={team.team_logo}
                                      alt={team.team_name || team.name}
                                      style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                    />
                                  )}
                                  <div className="text-truncate">
                                    <div className="fw-bold text-truncate">{team.team_name || team.name}</div>
                                    {team.rating && (
                                      <div className="small text-muted">
                                        Rating: {team.rating.toFixed(1)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-center mt-3">
                            <Button color="warning" size="sm">
                              <i className="fas fa-share-alt me-1"></i> Share
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded p-4">
                        <div className="text-center text-muted">
                          <p>No performance recommendation available</p>
                        </div>
                      </div>
                    )}
                  </Col>
                  
                  {/* Popularity Card */}
                  <Col md={6} className="mb-3">
                    {pair.popularity ? (
                      <Card className="h-100 shadow-sm">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Popularity Rankings</h5>
                          <Badge color="light" className="text-info">Popularity</Badge>
                        </div>
                        <div className="card-body">
                          <h6 className="border-bottom pb-2 mb-3">Top 4 Teams</h6>
                          <div className="row">
                            {pair.popularity.recommended_teams.map((team, idx) => (
                              <div className="col-md-6 mb-2" key={idx}>
                                <div className="d-flex align-items-center p-2 bg-light rounded">
                                  {team.team_logo && (
                                    <img
                                      src={team.team_logo}
                                      alt={team.team_name || team.name}
                                      style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                    />
                                  )}
                                  <div className="text-truncate">
                                    <div className="fw-bold text-truncate">{team.team_name || team.name}</div>
                                    {team.enrollment && (
                                      <div className="small text-muted">
                                        Enrollment: {team.enrollment.toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-center mt-3">
                          <Button color="warning" size="sm">
                            <i className="fas fa-share-alt me-1"></i> Share
                          </Button>
                        </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded p-4">
                        <div className="text-center text-muted">
                          <p>No popularity recommendation available</p>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
                
                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="mb-2">All Candidate Teams:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {(pair.performance || pair.popularity)?.candidate_teams.map((team, idx) => (
                      <span key={idx} className="badge bg-secondary py-2">
                        {team.team_name || team.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Add horizontal divider if not the last item */}
                {pairIndex < recommendationPairs.length - 1 && (
                  <hr className="mt-4 border-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;