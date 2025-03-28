import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      <main className="home-content">
        <h2>Welcome to Final Frontiers</h2>
      </main>
    </div>
  );
};

export default Home; 