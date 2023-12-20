import React, { useState } from 'react';
import '../../Pages/CSS/ReadAsset.css';

function DeletePatient() {
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
    );
}

export default DeletePatient;