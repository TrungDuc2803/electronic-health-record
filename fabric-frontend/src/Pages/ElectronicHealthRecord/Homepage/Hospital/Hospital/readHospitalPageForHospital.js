import React, { useState } from 'react';
import HospitalPageHeader from '../../Component/HospitalPageHeader';
import Footer from '../../Component/Footer';
import '../../../../CSS/ReadAsset.css';

function ReadHospitalPageForHospital() {
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const [hospitalID, setHospitalID] = useState('');
  const [assetData, setAssetData] = useState(null);
  const [error, setError] = useState('');

  const handleFetchAsset = async () => {
    try {
      // Send a GET request to fetch asset data by ID
      const response = await fetch(`http://localhost:3001/api/read-hospital/${hospitalID}`);

      if (response.ok) {
        // Asset data fetched successfully
        const data = await response.json();
        setAssetData(data);
        setError('');
      } else if (response.status === 404) {
        // Asset does not exist
        setError('The hospital does not exist');
        setAssetData(null);
      } else {
        // Error fetching asset data
        setError('Failed to fetch hospital');
        setAssetData(null);
      }
    } catch (error) {
      console.error(`Failed to fetch hospital: ${error}`);
      setError('Failed to fetch hospital');
      setAssetData(null);
    }
  };

  return (
    <div className="patient-page">
    <HospitalPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
    <div className="container">
      <h1>Read Hospital</h1>
      <div>
        <label>Hospital ID:</label>
        <input type="text" value={hospitalID} onChange={(e) => setHospitalID(e.target.value)} required />
        <button onClick={handleFetchAsset}>Fetch Hospital</button>
      </div>
      <div>
        {error && <p className="error">{error}</p>}
        {assetData && (
          <div>
            <h2>Hospital Details</h2>
            {Object.entries(assetData).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default ReadHospitalPageForHospital;
