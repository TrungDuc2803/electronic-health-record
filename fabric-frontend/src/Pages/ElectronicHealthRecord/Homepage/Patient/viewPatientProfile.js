import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../CSS/ReadAsset.css';
import PatientHeader from '../Component/PatientHeader';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';

function ViewPatientProfile() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const { userID } = useParams(); // Access the userID parameter from the URL
  const [assetData, setAssetData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleFetchAsset = async () => {
      try {
        // Send a GET request to fetch asset data by ID (using userID)
        const response = await fetch(`http://localhost:3001/api/read-patient/${userID}`);

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

    handleFetchAsset();
  }, [userID]); // Trigger the fetch when userID changes

  return (
    <div className="patient-page">
      <PatientHeader onCategorySelect={handleCategorySelect} />
    <div className="container">
      <h1>Read Patient</h1>
      <div>
        <p>UserID: {userID}</p>
        {/* Display fetched asset data */}
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

export default ViewPatientProfile;
