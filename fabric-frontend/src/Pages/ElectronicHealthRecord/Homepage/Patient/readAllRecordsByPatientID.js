// ReadAllPatients.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../CSS/MedicalRecord/ReadAllRecords.css';
import PatientHeader from '../Component/PatientHeader';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';

function ReadAllRecordsByPatientID() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const { userID } = useParams(); // Access the userID parameter from the URL
  const [patientID, setpatientID] = useState(userID);
  const [records, setRecords] = useState([]);
   
  useEffect(() => {
    // Fetch patients from your server
    fetch(`http://localhost:3001/api/read-records/${patientID}`) // Use the full URL
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
    <div className="patient-page">
    <PatientHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
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
    <Footer />
  </div>
  );
}

export default ReadAllRecordsByPatientID;
