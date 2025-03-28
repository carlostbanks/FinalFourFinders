import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';

interface SearchResult {
  id: number;
  name: string;
  // Add more fields as needed
}

const Home: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    // Handle Excel file processing here
    console.log('Files received:', files);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Implement search logic here
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
    // Implement filter logic here
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="home-content">
        <h2>Welcome to Final Four Finders</h2>
        
        <div className="search-section">
          <div className="file-upload-area">
            <div
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
              />
              <div className="upload-content">
                <i className="fas fa-file-excel"></i>
                <p>Drag and drop Excel files here or click to browse</p>
                <p className="file-types">Supported formats: .xlsx, .xls</p>
              </div>
            </div>
          </div>

          <div className="search-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="filter-dropdown">
              <select value={selectedFilter} onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h3>Search Results</h3>
          <div className="results-list">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div key={result.id} className="result-item">
                  <span>{result.name}</span>
                </div>
              ))
            ) : (
              <p className="no-results">No results found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 