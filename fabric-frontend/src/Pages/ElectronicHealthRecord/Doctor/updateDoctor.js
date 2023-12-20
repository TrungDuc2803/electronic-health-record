import React, { useState } from 'react';
import '../../CSS/UpdateAsset.css'

function UpdateDoctor() {
  const [doctorID, setdoctorID] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contactInfo, setcontactInfo] = useState('');
  const [hospitalID, sethospitalID] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to update the asset with the provided data
    const response = await fetch('http://localhost:3001/api/update-doctor', {
      method: 'PUT', // Use PUT request for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doctorID, firstName, lastName, specialization, contactInfo, hospitalID }),
    });

    if (response.ok) {
      // Asset update was successful
      setMessage('Doctor updated successfully');
      setError('');
    } else if (response.status === 404) {
      // Asset does not exist
      setError('The doctor does not exist');
      setMessage('');
    } else {
      // Asset update failed
      setError('Failed to update doctor');
      setMessage('');
    }
  };

  return (
    <div className="update-asset-container">
      <h1>Update Doctor</h1>
      <form onSubmit={handleSubmit} className="update-asset-form">
        <div className="form-group">
          <label>Doctor ID:</label>
          <input type="text" value={doctorID} onChange={(e) => setdoctorID(e.target.value)} required />
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
          <label>Specialization:</label>
          <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contact Info:</label>
          <input type="text" value={contactInfo} onChange={(e) => setcontactInfo(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Hospital ID:</label>
          <input type="text" value={hospitalID} onChange={(e) => sethospitalID(e.target.value)} required />
        </div>
        <button type="submit" className="update-asset-button">Update Doctor</button>
      </form>
      <p className="update-status-message">{message}</p>
    </div>
  );
}

export default UpdateDoctor;