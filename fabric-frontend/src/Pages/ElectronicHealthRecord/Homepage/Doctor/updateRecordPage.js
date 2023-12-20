import React, { useState } from 'react';
import DoctorPageHeader from '../Component/DoctorPageHeader';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';
import { useLocation } from 'react-router-dom';
import '../../../CSS/UpdateAsset.css'

function UpdateRecordPage() {
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

  const [recordID, setrecordID] = useState('');
  const [patientID, setpatientID] = useState('');
  const [doctorID, setdoctorID] = useState('');
  const [hospitalID, sethospitalID] = useState('');
  const [date, setDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to update the asset with the provided data
    const response = await fetch('http://localhost:3001/api/update-record', {
      method: 'PUT', // Use PUT request for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes }),
    });

    if (response.ok) {
      // Asset update was successful
      setMessage('Medical Record updated successfully');
      setError('');
    } else if (response.status === 404) {
      // Asset does not exist
      setError('Medical Record does not exist');
      setMessage('');
    } else {
      // Asset update failed
      setError('Failed to update Medical Record');
      setMessage('');
    }
  };

  return (
    <div className="patient-page">
    <DoctorPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} UserType={state?.UserType} Username={state?.Username} UserID={state?.UserID}/>
    <div className="update-asset-container">
      <h1>Update Medical Record</h1>
      <form onSubmit={handleSubmit} className="update-asset-form">
      <div className="form-group">
          <label>Record ID:</label>
          <input type="text" value={recordID} onChange={(e) => setrecordID(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Patient ID:</label>
          <input type="text" value={patientID} onChange={(e) => setpatientID(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Doctor ID:</label>
          <input type="text" value={doctorID} onChange={(e) => setdoctorID(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Hospital ID:</label>
          <input type="text" value={hospitalID} onChange={(e) => sethospitalID(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Diagnosis:</label>
          <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Treatment:</label>
          <input type="text" value={treatment} onChange={(e) => setTreatment(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Medications:</label>
          <input type="text" value={medications} onChange={(e) => setMedications(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} required />
        </div>
        <button type="submit" className="update-asset-button">Update Medical Record</button>
      </form>
      <p className="update-status-message">{message}</p>
    </div>
    <Footer />
  </div>
  );
}

export default UpdateRecordPage;