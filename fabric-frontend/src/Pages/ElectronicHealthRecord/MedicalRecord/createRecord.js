import React, { useState } from 'react';
import '../../CSS/CreateAsset.css';

function CreateRecord() {
  const [recordID, setrecordID] = useState('');
  const [patientID, setpatientID] = useState('');
  const [doctorID, setdoctorID] = useState('');
  const [hospitalID, sethospitalID] = useState('');
  const [date, setDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to your back-end to create a new asset
    const response = await fetch('http://localhost:3001/api/create-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes }),
    });

    if (response.ok) {
      // Asset creation was successful
      console.log('Medical Record created successfully');
    } else {
      // Asset creation failed
      console.error('Failed to create Medical Record');
    }
  };

  return (
    <div className="create-asset-container">
      <h1>Create Medical Record</h1>
      <form className="create-asset-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="create-asset-button">Create Medical Record</button>
      </form>
    </div>
  );
}

export default CreateRecord;
