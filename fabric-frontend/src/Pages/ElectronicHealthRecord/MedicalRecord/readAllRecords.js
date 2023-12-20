// ReadAllPatients.js
import React, { useState, useEffect } from 'react';
import '../../CSS/MedicalRecord/ReadAllRecords.css';

function ReadAllRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch patients from your server
    fetch('http://localhost:3001/api/records') // Use the full URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch records. Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Response is not in JSON format');
        }
      })
      .then((data) => setRecords(data))
      .catch((error) => console.error(`Failed to fetch patients: ${error}`));
  }, []);  

  return (
    <div>
      <h1>Medical Record List</h1>
      <table className="records-table">
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Hospital ID</th>
            <th>Date</th>
            <th>Diagnosis</th>
            <th>Treatment</th>
            <th>Medications</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.Key}>
              <td>{record.Record.RecordID}</td>
              <td>{record.Record.PatientID}</td>
              <td>{record.Record.DoctorID}</td>
              <td>{record.Record.HospitalID}</td>
              <td>{record.Record.Date}</td>
              <td>{record.Record.Diagnosis}</td>
              <td>{record.Record.Treatment}</td>
              <td>{record.Record.Medications}</td>
              <td>{record.Record.Notes}</td>
              {/* Add more details or icons here */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReadAllRecords;
