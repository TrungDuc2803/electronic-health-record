import React, { useState } from 'react';
import HospitalPageHeader from '../../Component/HospitalPageHeader.js';
import Footer from '../../Component/Footer.js';
import '../../../../CSS/ReadAsset.css';

function DeleteDoctorPage() {
    const [selectedCategory, setSelectedCategory] = useState(null); 

    const handleCategorySelect = (category) => {
      if (selectedCategory === category) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(category);
      }
    };

    const [doctorId, setdoctorId] = useState('');
    const [message, setMessage] = useState('');

    const handleDeleteAsset = async (event) => {
        event.preventDefault();

        // Send a request to your back-end to delete the asset
        const response = await fetch(`http://localhost:3001/api/delete-doctor/${doctorId}`, {
        method: 'DELETE',
        });

        if (response.ok) {
        // Asset deletion was successful
        setMessage(`Doctor ${doctorId} deleted successfully`);
        } else {
        // Asset deletion failed
        setMessage('Failed to delete doctor');
        }
    };

    return (
        <div className="patient-page">
        <HospitalPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        <div className="container">
        <h1>Delete Doctor</h1>
        <form onSubmit={handleDeleteAsset}>
            <div>
            <label>Doctor ID:</label>
            <input type="text" value={doctorId} onChange={(e) => setdoctorId(e.target.value)} required />
            </div>
            <button type="submit">Delete Doctor</button>
        </form>
        <p>{message}</p>
        </div>
        <Footer />
        </div>
    );
}

export default DeleteDoctorPage;
