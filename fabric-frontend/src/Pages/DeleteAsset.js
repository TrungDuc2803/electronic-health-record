import React, { useState } from 'react';
import './CSS/ReadAsset.css';

function DeleteAsset() {
    const [id, setId] = useState('');
    const [message, setMessage] = useState('');

    const handleDeleteAsset = async (event) => {
        event.preventDefault();

        // Send a request to your back-end to delete the asset
        const response = await fetch(`http://localhost:3001/api/delete-asset/${id}`, {
        method: 'DELETE',
        });

        if (response.ok) {
        // Asset deletion was successful
        setMessage(`Asset ${id} deleted successfully`);
        } else {
        // Asset deletion failed
        setMessage('Failed to delete asset');
        }
    };

    return (
        <div className="container">
        <h1>Delete Asset</h1>
        <form onSubmit={handleDeleteAsset}>
            <div>
            <label>Asset ID:</label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
            </div>
            <button type="submit">Delete Asset</button>
        </form>
        <p>{message}</p>
        </div>
    );
}

export default DeleteAsset;
