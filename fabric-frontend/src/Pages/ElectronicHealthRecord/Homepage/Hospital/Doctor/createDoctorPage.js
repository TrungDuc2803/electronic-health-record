import React, { useState } from 'react';
import HospitalPageHeader from '../../Component/HospitalPageHeader.js';
import Footer from '../../Component/Footer.js';
import '../../../../CSS/CreateAsset.css';

function CreateDoctorPage() {
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const [doctorID, setdoctorID] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalID, setHospitalID] = useState('');
  const [contactInfo, setcontactInfo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to your back-end to create a new asset
    const response = await fetch('http://localhost:3001/api/create-doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, doctorID, firstName, lastName, specialization, contactInfo, hospitalID }),
    });

    if (response.ok) {
      // Asset creation was successful
      console.log('Doctor created successfully');
    } else {
      // Asset creation failed
      console.error('Failed to create Doctor');
    }
  };

  return (
    <div className="patient-page">
    <HospitalPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
    <div className="create-asset-container">
      <h1>Create Doctor</h1>
      <form className="create-asset-form" onSubmit={handleSubmit}>
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
          <input type="text" value={hospitalID} onChange={(e) => setHospitalID(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="create-asset-button">Create Doctor</button>
      </form>
    </div>
    <Footer />
  </div>
  );
}

export default CreateDoctorPage;
