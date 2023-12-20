import React, { useState } from 'react';
import '../../Pages/CSS/CreateAsset.css';

function CreatePatient() {
  const [patientId, setpatientId] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to your back-end to create a new asset
    const response = await fetch('http://localhost:3001/api/create-patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, name, dob, gender, contact }),
    });

    if (response.ok) {
      // Asset creation was successful
      console.log('Patient created successfully');
    } else {
      // Asset creation failed
      console.error('Failed to create Patient');
    }
  };

  return (
    <div className="create-asset-container">
      <h1>Create Patient</h1>
      <form className="create-asset-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>PatientID:</label>
          <input type="text" value={patientId} onChange={(e) => setpatientId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>DateOfBirth:</label>
          <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>ContactInfo:</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
        <button type="submit" className="create-asset-button">Create Patient</button>
      </form>
    </div>
  );
}

export default CreatePatient;
