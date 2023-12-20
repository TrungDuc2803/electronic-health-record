import React, { useState, useEffect } from 'react';
import '../../Pages/CSS/ReadAllAssets.css';

function ReadAllPatients() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    // Fetch assets from your server
    fetch('http://localhost:3001/api/patients') // Use the full URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch assets. Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Response is not in JSON format');
        }
      })
      .then((data) => setAssets(data))
      .catch((error) => console.error(`Failed to fetch assets: ${error}`));
  }, []);  

  return (
    <div>
      <h1>Patient List</h1>
      <div className="asset-container">
        {assets.map((asset) => (
          <div key={asset.Key} className="asset-card">
            <h2>ID: {asset.Record.PatientID}</h2>
            <p>Name: {asset.Record.Name}</p>
            <p>Date of Birth: {asset.Record.DateOfBirth}</p>
            <p>Gender: {asset.Record.Gender}</p>
            <p>Contact Info: {asset.Record.ContactInfo}</p>
            {/* Add more details or icons here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadAllPatients;