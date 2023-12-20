// ReadAllPatients.js
import React, { useState, useEffect } from 'react';
import '../../../CSS/MedicalRecord/ReadAllRecords.css';
import HospitalPageHeader from '../Component/HospitalPageHeader';
import Footer from '../Component/Footer';

function ReadAllLogChanges() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const [logChanges, setLogChanges] = useState([]);

  useEffect(() => {
    // Fetch patients from your server
    fetch('http://localhost:3001/api/logChanges') // Use the full URL
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
      .then((data) => setLogChanges(data))
      .catch((error) => console.error(`Failed to fetch patients: ${error}`));
  }, []);  

  return (
    <div className="patient-page">
    <HospitalPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
    <div>
      <h1>Log Changes List</h1>
      <table className="records-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Username</th>
            <th>UserType</th>
            <th>UserID</th>
          </tr>
        </thead>
        <tbody>
          {logChanges.map((logChange) => (
            <tr key={logChange.Key}>
              <td>{logChange.Record.Timestamp}</td>
              <td>{logChange.Record.Username}</td>
              <td>{logChange.Record.UserType}</td>
              <td>{logChange.Record.UserID}</td>
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

export default ReadAllLogChanges;
