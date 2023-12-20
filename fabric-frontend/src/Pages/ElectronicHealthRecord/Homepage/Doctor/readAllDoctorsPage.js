// ReadAllPatients.js
import React, { useState, useEffect } from 'react';
import DoctorPageHeader from '../Component/DoctorPageHeader';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/ReadAllPatients.css';
import doctorImage from '../../../Images/doctor3.png'

function ReadAllDoctorsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch patients from your server
    fetch('http://localhost:3001/api/doctors') // Use the full URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Response is not in JSON format');
        }
      })
      .then((data) => setDoctors(data))
      .catch((error) => console.error(`Failed to fetch patients: ${error}`));
  }, []);  

  return (
    <div className="patient-page">
      <DoctorPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
    <div>
      <h1>Doctor List</h1>
      <div className="patients-grid">
        {doctors.map((doctor) => (
          <div key={doctor.Key} className="patient-card">
            <img src={doctorImage} alt={`Patient ${doctor.Record.DoctorID}`} />
            <div className="patient-details">
              <h2>{`${doctor.Record.FirstName} ${doctor.Record.LastName}`}</h2>
              <p>ID: {doctor.Record.DoctorID}</p>
              <p>Specialization: {doctor.Record.Specialization}</p>
              <p>Contact Info: {doctor.Record.ContactInfo}</p>
              <p>Hospital ID: {doctor.Record.HospitalID}</p>
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

export default ReadAllDoctorsPage;














