import React, { useState } from 'react';
import '../../CSS/UpdateAsset.css'

function UpdatePatient() {
  const [patientID, setpatientID] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [dateOfBirth, setdateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [contactInfo, setcontactInfo] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to update the asset with the provided data
    const response = await fetch('http://localhost:3001/api/update-patient', {
      method: 'PUT', // Use PUT request for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientID, firstName, lastName, dateOfBirth, gender, contactInfo }),
    });

    if (response.ok) {
      // Asset update was successful
      setMessage('Patient updated successfully');
      setError('');
    } else if (response.status === 404) {
      // Asset does not exist
      setError('The patient does not exist');
      setMessage('');
    } else {
      // Asset update failed
      setError('Failed to update patient');
      setMessage('');
    }
  };

  return (
    <div className="update-asset-container">
      <h1>Update Patient</h1>
      <form onSubmit={handleSubmit} className="update-asset-form">
        <div className="form-group">
          <label>Patient ID:</label>
          <input type="text" value={patientID} onChange={(e) => setpatientID(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setfirstName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setlastName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="text" value={dateOfBirth} onChange={(e) => setdateOfBirth(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contact Info:</label>
          <input type="text" value={contactInfo} onChange={(e) => setcontactInfo(e.target.value)} required />
        </div>
        <button type="submit" className="update-asset-button">Update Patient</button>
      </form>
      <p className="update-status-message">{message}</p>
    </div>
  );
}

export default UpdatePatient;