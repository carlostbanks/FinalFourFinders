import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Define constant list of major schools to ensure stability
const MAJOR_SCHOOLS = [
  { id: 1, name: "Alabama" },
  { id: 2, name: "Arizona" },
  { id: 3, name: "Arizona State" },
  { id: 4, name: "Arkansas" },
  { id: 5, name: "Auburn" },
  { id: 6, name: "Baylor" },
  { id: 7, name: "Boston College" },
  { id: 8, name: "BYU" },
  { id: 9, name: "California" },
  { id: 10, name: "Cincinnati" },
  { id: 11, name: "Clemson" },
  { id: 12, name: "Colorado" },
  { id: 13, name: "Connecticut" },
  { id: 14, name: "Duke" },
  { id: 15, name: "Florida" },
  { id: 16, name: "Florida State" },
  { id: 17, name: "Georgetown" },
  { id: 18, name: "Georgia" },
  { id: 19, name: "Georgia Tech" },
  { id: 20, name: "Gonzaga" },
  { id: 21, name: "Harvard" },
  { id: 22, name: "Illinois" },
  { id: 23, name: "Indiana" },
  { id: 24, name: "Iowa" },
  { id: 25, name: "Iowa State" },
  { id: 26, name: "Kansas" },
  { id: 27, name: "Kansas State" },
  { id: 28, name: "Kentucky" },
  { id: 29, name: "Louisville" },
  { id: 30, name: "LSU" },
  { id: 31, name: "Marquette" },
  { id: 32, name: "Maryland" },
  { id: 33, name: "Memphis" },
  { id: 34, name: "Miami (FL)" },
  { id: 35, name: "Michigan" },
  { id: 36, name: "Michigan State" },
  { id: 37, name: "Minnesota" },
  { id: 38, name: "Mississippi" },
  { id: 39, name: "Mississippi State" },
  { id: 40, name: "Missouri" },
  { id: 41, name: "NC State" },
  { id: 42, name: "Nebraska" },
  { id: 43, name: "North Carolina" },
  { id: 44, name: "Northwestern" },
  { id: 45, name: "Notre Dame" },
  { id: 46, name: "Ohio State" },
  { id: 47, name: "Oklahoma" },
  { id: 48, name: "Oklahoma State" },
  { id: 49, name: "Oregon" },
  { id: 50, name: "Oregon State" },
  { id: 51, name: "Penn State" },
  { id: 52, name: "Pittsburgh" },
  { id: 53, name: "Princeton" },
  { id: 54, name: "Purdue" },
  { id: 55, name: "Rutgers" },
  { id: 56, name: "Syracuse" },
  { id: 57, name: "Tennessee" },
  { id: 58, name: "Texas" },
  { id: 59, name: "UCLA" },
  { id: 60, name: "Vanderbilt" },
  { id: 61, name: "Villanova" },
  { id: 62, name: "Virginia" },
  { id: 63, name: "Virginia Tech" },
  { id: 64, name: "Wake Forest" },
  { id: 65, name: "Washington" },
  { id: 66, name: "West Virginia" },
  { id: 67, name: "Wisconsin" },
  { id: 68, name: "Yale" },
];

interface SearchResult {
  id: number;
  name: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Search dropdown state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchools, setFilteredSchools] = useState(MAJOR_SCHOOLS);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter schools based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSchools(MAJOR_SCHOOLS);
    } else {
      const filtered = MAJOR_SCHOOLS.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSchoolSelect = (school: {id: number, name: string}) => {
    // Check if already added to avoid duplicates
    const alreadyAdded = searchResults.some(result => result.name === school.name);
    
    if (!alreadyAdded) {
      const newResult: SearchResult = {
        id: school.id,
        name: school.name
      };
      setSearchResults(prev => [...prev, newResult]);
    }
    
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleClearResults = () => {
    setSearchResults([]);
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
      
      // Read the Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Assuming the excel file has school names in a column named "School" or "Name"
          const schools = jsonData.map((row: any) => {
            const schoolName = row.School || row.Name || row.SCHOOL || row.NAME || Object.values(row)[0];
            return {
              id: Math.random(),
              name: String(schoolName)
            };
          });
          
          // Add to search results - use the function properly
          setSearchResults((currentResults) => [...currentResults, ...schools]);
        } catch (error) {
          console.error("Error parsing Excel:", error);
          alert("Could not parse the Excel file. Please ensure it contains school names.");
        }
      };
      
      reader.onerror = () => {
        alert('Error reading file');
      };
      
      reader.readAsBinaryString(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    }
  };

  const handleGetRecommendation = async () => {
    if (searchResults.length < 4) {
      alert('Please add at least 4 schools to get recommendations');
      return;
    }
    
    try {
      // Extract just the school names from search results
      const schoolNames = searchResults.map(result => result.name);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to save recommendations');
        navigate('/login');
        return;
      }
      
      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'loading-overlay';
      loadingDiv.innerHTML = '<div class="spinner"></div><p>Generating recommendations...</p>';
      loadingDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; z-index: 1000;';
      document.body.appendChild(loadingDiv);
      
      try {
        // Make API calls for both performance and popularity rankings
        const apiUrl = 'https://finalfourfinders-api.onrender.com/api/recommendations';
        
        // Performance recommendation - use the correct format
        const performanceResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            "recommendation_type": "performance",
            "candidate_teams": schoolNames
          })
        });
        
        if (!performanceResponse.ok) {
          const errorText = await performanceResponse.text();
          console.error('Performance API error:', errorText);
          throw new Error(`Failed to get performance recommendations: ${performanceResponse.status}`);
        }
        
        // Popularity recommendation
        const popularityResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            "recommendation_type": "popularity",
            "candidate_teams": schoolNames
          })
        });
        
        if (!popularityResponse.ok) {
          const errorText = await popularityResponse.text();
          console.error('Popularity API error:', errorText);
          throw new Error(`Failed to get popularity recommendations: ${popularityResponse.status}`);
        }
        
        // If we got here, both API calls were successful
        navigate('/results');
        
      } catch (apiError) {
        console.error('API call error:', apiError);
        // alert('Error: ' + apiError.message);
      } finally {
        // Remove loading indicator
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay && loadingOverlay.parentNode) {
          loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
      }
    } catch (error) {
      console.error('Error in recommendation process:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
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
              style={{
                border: '2px dashed #ccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? '#f0f8ff' : 'white'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
              />
              <div className="upload-content">
                <i className="fas fa-file-excel" style={{ fontSize: '24px', color: '#4CAF50' }}></i>
                <p>Drag and drop Excel files here or click to browse</p>
                <p className="file-types" style={{ fontSize: '12px', color: '#666' }}>Supported formats: .xlsx, .xls</p>
              </div>
            </div> 
          </div>

          <div id="searchSchools-box" className="search-controls" style={{ marginTop: '20px' }}>
            <div className="school-search-container" ref={dropdownRef} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search for a school..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setIsDropdownOpen(true)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
              
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderTop: 'none',
                  borderRadius: '0 0 4px 4px',
                  zIndex: 10,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  {filteredSchools.length > 0 ? (
                    filteredSchools.map(school => (
                      <div 
                        key={school.id}
                        onClick={() => handleSchoolSelect(school)}
                        style={{
                          padding: '10px',
                          borderBottom: '1px solid #eee',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {school.name}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '10px', color: '#888' }}>
                      No schools found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="search-results" className="results-section" style={{ marginTop: '30px' }}>
          <h3>Selected Schools</h3>
          <div className="results-list" style={{ 
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            minHeight: '100px'
          }}>
            {searchResults.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {searchResults.map((result) => (
                  <div key={result.id} className="result-item" style={{
                    backgroundColor: '#e9f5ff',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    display: 'inline-block'
                  }}>
                    <span>{result.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-results" style={{ color: '#888', textAlign: 'center' }}>
                No schools selected. Search and select schools above.
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <button 
              className="recommendation-button"
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                width: 'auto',
                maxWidth: '250px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={handleGetRecommendation}
            >
              Get Recommendation
            </button>
            <button 
              className="clear-button"
              onClick={handleClearResults}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                width: 'auto',
                maxWidth: '250px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Schools
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;