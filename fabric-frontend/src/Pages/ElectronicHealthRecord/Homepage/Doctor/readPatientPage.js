import React, { useState } from 'react';
import DoctorPageHeader from '../Component/DoctorPageHeader';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';
import { useLocation } from 'react-router-dom';
import '../../../CSS/ReadAsset.css';

function ReadPatientPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Use useLocation to get the current location
  const location = useLocation();
  const { state } = location;  

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const [patientID, setPatientID] = useState('');
  const [assetData, setAssetData] = useState(null);
  const [error, setError] = useState('');

  const handleFetchAsset = async () => {
    try {
      // Send a GET request to fetch asset data by ID
      const response = await fetch(`http://localhost:3001/api/read-patient/${patientID}`);

      if (response.ok) {
        // Asset data fetched successfully
        const data = await response.json();
        setAssetData(data);
        setError('');
      } else if (response.status === 404) {
        // Asset does not exist
        setError('The asset does not exist');
        setAssetData(null);
      } else {
        // Error fetching asset data
        setError('Failed to fetch asset');
        setAssetData(null);
      }
    } catch (error) {
      console.error(`Failed to fetch asset: ${error}`);
      setError('Failed to fetch asset');
      setAssetData(null);
    }
  };

  return (
    <div className="patient-page">
    <DoctorPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} UserType={state?.UserType} Username={state?.Username} UserID={state?.UserID}/>
    <div className="container">
      <h1>Read Patient</h1>
      <div>
        <label>Patient ID:</label>
        <input type="text" value={patientID} onChange={(e) => setPatientID(e.target.value)} required />
        <button onClick={handleFetchAsset}>Fetch Asset</button>
      </div>
      <div>
        {error && <p className="error">{error}</p>}
        {assetData && (
          <div>
            <h2>Asset Details</h2>
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

export default ReadPatientPage;