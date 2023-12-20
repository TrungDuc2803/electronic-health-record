import React, { useState } from 'react';
import '../../Pages/CSS/UpdateAsset.css'

function UpdatePatient() {
    const [patientId, setpatientId] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [contact, setContact] = useState('');
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
      body: JSON.stringify({ patientId, name, dob, gender, contact }),
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
          <input type="text" value={patientId} onChange={(e) => setpatientId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contact Info:</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
        <button type="submit" className="update-asset-button">Update Patient</button>
      </form>
      <p className="update-status-message">{message}</p>
    </div>
  );
}

export default UpdatePatient;