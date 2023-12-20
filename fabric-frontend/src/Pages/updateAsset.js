import React, { useState } from 'react';
import './CSS/UpdateAsset.css'

function UpdateAsset() {
  const [id, setId] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [owner, setOwner] = useState('');
  const [appraisedValue, setAppraisedValue] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to update the asset with the provided data
    const response = await fetch('http://localhost:3001/api/update-asset', {
      method: 'PUT', // Use PUT request for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, color, size, owner, appraisedValue }),
    });

    if (response.ok) {
      // Asset update was successful
      setMessage('Asset updated successfully');
      setError('');
    } else if (response.status === 404) {
      // Asset does not exist
      setError('The asset does not exist');
      setMessage('');
    } else {
      // Asset update failed
      setError('Failed to update asset');
      setMessage('');
    }
  };

  return (
    <div className="update-asset-container">
      <h1>Update Asset</h1>
      <form onSubmit={handleSubmit} className="update-asset-form">
        <div className="form-group">
          <label>ID:</label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Color:</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Size:</label>
          <input type="text" value={size} onChange={(e) => setSize(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Owner:</label>
          <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Appraised Value:</label>
          <input type="text" value={appraisedValue} onChange={(e) => setAppraisedValue(e.target.value)} required />
        </div>
        <button type="submit" className="update-asset-button">Update Asset</button>
      </form>
      <p className="update-status-message">{message}</p>
    </div>
  );
}

export default UpdateAsset;
