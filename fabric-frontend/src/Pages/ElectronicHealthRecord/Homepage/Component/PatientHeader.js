// Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../../../CSS/Patient/PatientPage.css';
import { useUser } from '../../Login/UserContext';

const PatientHeader = () => {
  const { user } = useUser();
  return (
    <div className="header">
      <div className="dropdown">
        <a href="#">Patient ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/view-patient-profile/${user.UserID}`}>View My Profile</Link></a>
          <a><Link to={`/update-patient-profile/${user.UserID}`}>Update My Profile</Link></a>
          <a><Link to={`/read-patient-records/${user.UserID}`}>Read My Medical Records</Link></a>
        </div>
      </div>

      <div className="dropdown">
        <a href="#">Doctor ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/read-all-doctors-page-for-patient`}>View All Doctor</Link></a>
          <a><Link to={`/read-doctor-page-for-patient`}>Search Doctor</Link></a>
        </div>
      </div>

      <div className="dropdown">
        <a href="#">Hospital ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/read-all-hospitals`}>View All Hospital</Link></a>
          <a><Link to={`/read-all-hospitals`}>Search Hospital</Link></a>
        </div>
      </div>

      <div className="welcome-message">
        Welcome, {user.UserType} {user.Username}
      </div>
    </div>
  );
};

export default PatientHeader;




