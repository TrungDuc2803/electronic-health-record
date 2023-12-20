import React, { useState } from 'react';
import PatientHeader from '../Component/PatientHeader';
import Footer from '../Component/Footer';
import Header from '../Component/PatientHeader';
import { useUser } from '../../Login/UserContext';
import '../../../CSS/ReadAsset.css';

function ReadDoctorPageForPatient() {
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const { user } = useUser();

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const [doctorID, setDoctorID] = useState('');
  const [assetData, setAssetData] = useState(null);
  const [error, setError] = useState('');

  const handleFetchAsset = async () => {
    try {
      // Send a GET request to fetch asset data by ID
      const response = await fetch(`http://localhost:3001/api/read-doctor/${doctorID}`);

      if (response.ok) {
        // Asset data fetched successfully
        const data = await response.json();
        setAssetData(data);
        setError('');
      } else if (response.status === 404) {
        // Asset does not exist
        setError('The doctor does not exist');
        setAssetData(null);
      } else {
        // Error fetching asset data
        setError('Failed to fetch doctor');
        setAssetData(null);
      }
    } catch (error) {
      console.error(`Failed to fetch doctor: ${error}`);
      setError('Failed to fetch doctor');
      setAssetData(null);
    }
  };

  return (
    <div className="patient-page">
      {user?.UserID === 'doctor' ? (
        <PatientHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      ) : (
        <Header onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      )}
    <div className="container">
      <h1>Read Doctor</h1>
      <div>
        <label>Doctor ID:</label>
        <input type="text" value={doctorID} onChange={(e) => setDoctorID(e.target.value)} required />
        <button onClick={handleFetchAsset}>Fetch Doctor</button>
      </div>
      <div>
        {error && <p className="error">{error}</p>}
        {assetData && (
          <div>
            <h2>Doctor Details</h2>
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

export default ReadDoctorPageForPatient;