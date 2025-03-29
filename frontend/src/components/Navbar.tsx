import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleViewRecommendation = () => {
    navigate('/recommendations');
  };
  
  const handleTitleClick = () => {
    navigate('/home');
  };

  

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
        <h1>Final Four Finders</h1>
      </div>
      {isAuthenticated && (
        <div className="navbar-user">
            <button onClick={handleViewRecommendation} className="recommendation-button" style={{ whiteSpace: 'nowrap' }}>
            View Recommendations
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;