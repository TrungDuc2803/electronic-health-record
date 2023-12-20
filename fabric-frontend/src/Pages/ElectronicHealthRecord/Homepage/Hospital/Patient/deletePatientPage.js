import React, { useState } from 'react';
import HospitalPageHeader from '../../Component/HospitalPageHeader';
import Footer from '../../Component/Footer';
import '../../../../CSS/ReadAsset.css';

function DeletePatientPage() {
    const [selectedCategory, setSelectedCategory] = useState(null); 

    const handleCategorySelect = (category) => {
      if (selectedCategory === category) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(category);
      }
    };

    const [patientId, setpatientId] = useState('');
    const [message, setMessage] = useState('');

    const handleDeleteAsset = async (event) => {
        event.preventDefault();

        // Send a request to your back-end to delete the asset
        const response = await fetch(`http://localhost:3001/api/delete-patient/${patientId}`, {
        method: 'DELETE',
        });

        if (response.ok) {
        // Asset deletion was successful
        setMessage(`Patient ${patientId} deleted successfully`);
        } else {
        // Asset deletion failed
        setMessage('Failed to delete patient');
        }
    };

    return (
        <div className="patient-page">
        <HospitalPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        <div className="container">
        <h1>Delete Patient</h1>
        <form onSubmit={handleDeleteAsset}>
            <div>
            <label>Patient ID:</label>
            <input type="text" value={patientId} onChange={(e) => setpatientId(e.target.value)} required />
            </div>
            <button type="submit">Delete Patient</button>
        </form>
        <p>{message}</p>
        </div>
        <Footer />
        </div>
    );
}

export default DeletePatientPage;