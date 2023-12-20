import React, { useState } from 'react';
import '../../CSS/ReadAsset.css';

function DeleteDoctor() {
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
    );
}

export default DeleteDoctor;
