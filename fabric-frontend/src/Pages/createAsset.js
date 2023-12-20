import React, { useState } from 'react';
import './CSS/CreateAsset.css'

function CreateAsset() {
  const [id, setId] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [owner, setOwner] = useState('');
  const [appraisedValue, setAppraisedValue] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a request to your back-end to create a new asset
    const response = await fetch('http://localhost:3001/api/create-asset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, color, size, owner, appraisedValue }),
    });

    if (response.ok) {
      // Asset creation was successful
      console.log('Asset created successfully');
    } else {
      // Asset creation failed
      console.error('Failed to create asset');
    }
  };

  return (
    <div className="create-asset-container">
      <h1>Create Asset</h1>
      <form className="create-asset-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="create-asset-button">Create Asset</button>
      </form>
    </div>
  );
}

export default CreateAsset;

