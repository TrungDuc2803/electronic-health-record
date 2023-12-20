// ReadAllPatients.js
import React, { useState, useEffect } from 'react';
import HospitalPageHeader from '../../Component/HospitalPageHeader';
import Footer from '../../Component/Footer';
import '../../../../CSS/Patient/ReadAllPatients.css';
import hospitalIcon from '../../../../Images/hospitalIcon1.png';

function ReadAllHospitalsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const [hospitals, setHospital] = useState([]);

  useEffect(() => {
    // Fetch patients from your server
    fetch('http://localhost:3001/api/hospitals') // Use the full URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch hospitals. Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Response is not in JSON format');
        }
      })
      .then((data) => setHospital(data))
      .catch((error) => console.error(`Failed to fetch patients: ${error}`));
  }, []);  

  return (
    <div className="patient-page">
      <HospitalPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
    <div>
      <h1>Hospital List</h1>
      <div className="patients-grid">
        {hospitals.map((hospital) => (
          <div key={hospital.Key} className="patient-card">
            <img src={hospitalIcon} alt={`Patient ${hospital.Record.HospitalID}`} />
            <div className="patient-details">
              <h2>{`${hospital.Record.HospitalName}`}</h2>
              <p>ID: {hospital.Record.HospitalID}</p>
              <p>Location: {hospital.Record.Location}</p>
              <p>Contact Info: {hospital.Record.ContactInfo}</p>
              {/* Add more details or icons here */}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
  );
}

export default ReadAllHospitalsPage;














