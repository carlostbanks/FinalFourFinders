import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';

interface SearchResult {
  id: number;
  name: string;
  // Add more fields as needed
}

const Home: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearResults = () => {
    setSearchResults([]);
    setSelectedFilter('all');
  };

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

  const handleFiles = async (files: FileList) => {
    try {
      const file = files[0];
      if (!file) return;
      
      // Add file type validation
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        alert('Please upload a valid Excel file');
        return;
      }
      
      // Add file size validation (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      // TODO: Implement actual Excel processing
      // You might want to use a library like xlsx or exceljs
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedFilter(selectedValue);
    
    // Only add to search results if there's a meaningful search
    if (selectedValue !== 'all') {
      const newResult: SearchResult = {
        id: searchResults.length + 1,
        name: selectedValue
      };
      setSearchResults(prevResults => [...prevResults, newResult]);
    }
  };

  const handleGetRecommendation = () => {
    if (searchResults.length === 0) {
      alert('Please add some schools to get recommendations');
      return;
    }
    // TODO: Implement recommendation logic
    console.log('Getting recommendations for:', searchResults);
  };

  return (
    <div className="home-container" style={{ marginTop: '0' }}>
      <Navbar />
      <main className="home-content" style={{ marginTop: '0' }}>
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

          <div id="searchSchools-box" className="search-controls">
            <div id="schools-dropdown" className="filter-dropdown">
              <select value={selectedFilter} onChange={handleFilterChange}>
                <option value="Georgia Tech">Georgia Tech</option>
                <option value="Virginia tech">Virginia tech</option>
                <option value="Western Kentucky">Western Kentucky</option>
                <option value="Dartmouth">Dartmouth</option>
              </select>
            </div>
          </div>
        </div>

        <div id="search-results" className="results-section">
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
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              className="recommendation-button"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                width: 'auto',
                maxWidth: '200px'
              }}
              onClick={handleGetRecommendation}
            >
              Get Recommendation
            </button>
            <button 
              className="clear-button"
              onClick={handleClearResults}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                width: 'auto',
                maxWidth: '200px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Results
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 