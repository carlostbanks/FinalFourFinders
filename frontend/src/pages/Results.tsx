import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card, Row, Col, Button, Container, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

interface Team {
  name: string;
  found: boolean;
  rating: number;
  team_name: string;
  team_logo?: string;
  avg_win_percentage?: number;
  enrollment?: number;
  message?: string;
}

interface Recommendation {
  id: number;
  title: string;
  created_at: string;
  recommended_teams: Team[];
  candidate_teams: Team[];
  recommendation_type?: string;
}

const Result: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Get token from localStorage
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
          if (response.status === 401) {
            // Token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            setError('Your session has expired. Please log in again.');
          } else {
            throw new Error('Failed to fetch recommendations');
          }
        } else {
          const data = await response.json();
          // Sort recommendations by created_at in descending order (newest first)
          const sortedRecommendations = (data.recommendations || []).sort((a: Recommendation, b: Recommendation) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          setRecommendations(sortedRecommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Error fetching recommendations. Please try again later.');
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

  if (loading) {
    return (
      <div className="loading-container">
        <Navbar />
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Navbar />
        <div className="text-center mt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Button color="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Determine recommendation type (this is needed because the backend might not explicitly mark the type)
  const getRecommendationType = (rec: Recommendation): 'performance' | 'popularity' => {
    if (rec.recommendation_type === 'popularity') return 'popularity';
    if (rec.recommendation_type === 'performance') return 'performance';
    
    // If type isn't explicitly set, try to infer from the data
    if (rec.recommended_teams.some(team => typeof team.enrollment === 'number')) {
      return 'popularity';
    }
    return 'performance'; // Default to performance
  };

  // Group recommendations by type
  const recommendationsByType = recommendations.reduce((acc, rec) => {
    const type = getRecommendationType(rec);
    if (!acc[type]) acc[type] = [];
    acc[type].push(rec);
    return acc;
  }, {} as Record<'performance' | 'popularity', Recommendation[]>);

  // Get latest of each type
  const latestPerformance = recommendationsByType.performance?.[0] || null;
  const latestPopularity = recommendationsByType.popularity?.[0] || null;

  if (!latestPerformance && !latestPopularity) {
    return (
      <div className="no-results-container">
        <Navbar />
        <div className="text-center mt-5">
          <h3>No recommendations found</h3>
          <p>Create new recommendations on the home page.</p>
          <Button color="primary" onClick={() => navigate('/home')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <Navbar />
      <Container className="my-4">
        <h2 className="text-center mb-4">Your Tournament Recommendations</h2>
        
        <Row>
          {/* Performance Recommendation */}
          {latestPerformance && (
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">Performance Rankings</h3>
                    <p className="small mb-0">Based on historical win percentages</p>
                  </div>
                  <Badge color="light" className="text-primary">
                    Performance
                  </Badge>
                </div>
                <div className="card-body">
                  <h4 className="text-center mb-4">Top 4 Teams</h4>
                  {latestPerformance.recommended_teams.map((team, index) => (
                    <div key={index} className="mb-3 border-bottom pb-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3 fs-4 fw-bold text-primary">{index + 1}</div>
                        <div className="d-flex align-items-center flex-grow-1">
                          {team.team_logo && (
                            <img 
                              src={team.team_logo} 
                              alt={team.team_name} 
                              className="me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            />
                          )}
                          <div>
                            <h5 className="mb-0">{team.team_name || team.name}</h5>
                            <div className="text-muted small">Win Rate: {(team.avg_win_percentage || 0).toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span className="badge bg-success fs-6">{team.rating?.toFixed(1) || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-4">
                    <Button color="primary" onClick={() => navigate('/recommendations')}>
                      View All Recommendations
                    </Button>
                  </div>
                </div>
                <div className="card-footer text-muted">
                  Created on {formatDate(latestPerformance.created_at)}
                </div>
              </Card>
            </Col>
          )}
          
          {/* Popularity Recommendation */}
          {latestPopularity && (
            <Col md={latestPerformance ? 6 : 12} className="mb-4">
              <Card className="h-100 shadow">
                <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">Popularity Rankings</h3>
                    <p className="small mb-0">Based on school enrollment size</p>
                  </div>
                  <Badge color="light" className="text-info">
                    Popularity
                  </Badge>
                </div>
                <div className="card-body">
                  <h4 className="text-center mb-4">Top 4 Teams</h4>
                  {latestPopularity.recommended_teams.map((team, index) => (
                    <div key={index} className="mb-3 border-bottom pb-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3 fs-4 fw-bold text-info">{index + 1}</div>
                        <div className="d-flex align-items-center flex-grow-1">
                          {team.team_logo && (
                            <img 
                              src={team.team_logo} 
                              alt={team.team_name} 
                              className="me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            />
                          )}
                          <div>
                            <h5 className="mb-0">{team.team_name || team.name}</h5>
                            <div className="text-muted small">Enrollment: {team.enrollment?.toLocaleString() || "N/A"}</div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span className="badge bg-info fs-6">{team.rating?.toFixed(0) || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-4">
                    <Button color="info" onClick={() => navigate('/recommendations')}>
                      View All Recommendations
                    </Button>
                  </div>
                </div>
                <div className="card-footer text-muted">
                  Created on {formatDate(latestPopularity.created_at)}
                </div>
              </Card>
            </Col>
          )}
        </Row>
        
        <div className="mt-4 p-4 bg-light rounded text-center">
          <h4 className="mb-3">All Selected Schools</h4>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {(latestPerformance || latestPopularity)?.candidate_teams.map((team, index) => (
              <span 
                key={index} 
                className={`badge ${team.found ? 'bg-secondary' : 'bg-warning text-dark'} py-2 px-3`}
              >
                {team.name}
              </span>
            ))}
          </div>
          
          <div className="mt-4">
            <Button color="success" onClick={() => navigate('/home')}>
              Create New Recommendation
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Result;