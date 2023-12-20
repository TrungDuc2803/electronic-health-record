import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../CSS/ReadAsset.css';
import DoctorPageHeader from '../Component/DoctorPageHeader';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';
import { useLocation } from 'react-router-dom';

function ViewDoctorProfile() {
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
        <DoctorPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} UserType={state?.UserType} Username={state?.Username} UserID={userID}/>
        <div className="container">
        <h1>Read Doctor</h1>
        <p>UserID: {userID}</p>
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

export default ViewDoctorProfile;