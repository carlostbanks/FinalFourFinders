import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Final Four Finders</h1>
      </div>
      {isAuthenticated && (
        <div className="navbar-user">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 