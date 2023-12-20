// Footer.js
import React from 'react';
import '../../../CSS/Patient/PatientPage.css';

function Footer() {
  return (
    <div className="footer">
      <div className="section">
        <h3>Electronic Health Record</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero in
          turpis convallis, nec faucibus elit facilisis.
        </p>
      </div>

      <div className="section">
        <h3>About Us</h3>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium.
        </p>
      </div>

      <div className="section">
        <h3>Contact Us</h3>
        <p>Email: contact@example.com</p>
        <p>Phone: +1 123-456-7890</p>
      </div>
    </div>
  );
};

export default Footer;
