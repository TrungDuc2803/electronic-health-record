import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../../CSS/MedicalRecord/ReadAllRecords.css';
import HospitalPageHeader from '../../Component/HospitalPageHeader.js';
import Footer from '../../Component/Footer.js';
import { useLocation } from 'react-router-dom';

function ReadAllRecordsByPatientIDForHos() {
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

  const { userID } = useParams(); // Access the userID parameter from the URL
  const [patientID, setPatientID] = useState('');
  const [records, setRecords] = useState([]);
  const [searchPatientID, setSearchPatientID] = useState('');

  const handleSearch = () => {
    setPatientID(searchPatientID);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Fetch records from your server
        const response = patientID
          ? await fetch(`http://localhost:3001/api/read-records/${patientID}`)
          : await fetch('http://localhost:3001/api/records');

        if (!response.ok) {
          throw new Error(`Failed to fetch records. Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setRecords(data);
        } else {
          throw new Error('Response is not in JSON format');
        }
      } catch (error) {
        console.error(`Failed to fetch records: ${error}`);
      }
    };

    fetchRecords();
  }, [patientID]);

  return (
    <div className="patient-page">
      <HospitalPageHeader
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        UserType={state?.UserType}
        Username={state?.Username}
        UserID={userID}
      />
      <div>
        <h1>Medical Record List</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={searchPatientID}
            onChange={(e) => setSearchPatientID(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
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

export default ReadAllRecordsByPatientIDForHos;


