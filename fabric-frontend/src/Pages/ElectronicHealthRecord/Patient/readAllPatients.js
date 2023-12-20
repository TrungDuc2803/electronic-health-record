// ReadAllPatients.js
import React, { useState, useEffect } from 'react';
import '../../CSS/Patient/ReadAllPatients.css';
import patientImage from '../../Images/patient2.png'

function ReadAllPatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch patients from your server
    fetch('http://localhost:3001/api/patients') // Use the full URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch patients. Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Response is not in JSON format');
        }
      })
      .then((data) => setPatients(data))
      .catch((error) => console.error(`Failed to fetch patients: ${error}`));
  }, []);  

  return (
    <div>
      <h1>Patient List</h1>
      <div className="patients-grid">
        {patients.map((patient) => (
          <div key={patient.Key} className="patient-card">
            <img src={patientImage} alt={`Patient ${patient.Record.PatientID}`} />
            <div className="patient-details">
              <h2>{`${patient.Record.FirstName} ${patient.Record.LastName}`}</h2>
              <p>ID: {patient.Record.PatientID}</p>
              <p>Date of Birth: {patient.Record.DateOfBirth}</p>
              <p>Gender: {patient.Record.Gender}</p>
              <p>Contact Info: {patient.Record.ContactInfo}</p>
              {/* Add more details or icons here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadAllPatients;














