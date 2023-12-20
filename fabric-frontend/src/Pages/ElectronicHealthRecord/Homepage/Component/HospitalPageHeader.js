import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../Login/UserContext';

const HospitalPageHeader = () => {
  const { user } = useUser();
  return (
    <div className="header">
      <div className="dropdown">
        <a href="#">Patient ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/read-all-patients-page-for-hospital`}>View All Patients</Link></a>
          <a><Link to={`/read-patient-page-for-hospital`}>Search Patient</Link></a>
          <a><Link to={`/create-patient-page`}>Create Patient</Link></a>
          <a><Link to={`/update-patient-profile-for-hospital/${user.UserID}`}>Update Patient Profile</Link></a>
          <a><Link to={`/delete-patient-page`}>Delete Patient</Link></a>
        </div>
      </div>

      <div className="dropdown">
        <a href="#">Doctor ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/read-all-doctors-page-for-hospital`}>View All Doctors</Link></a>
          <a><Link to={`/read-doctor-page-for-hospital`}>Search Doctor</Link></a>
          <a><Link to={`/create-doctor-page`}>Create Doctor Profile</Link></a>
          <a><Link to={`/update-doctor-profile-for-hospital/${user.UserID}`}>Update Doctor Profile</Link></a>
          <a><Link to={`/delete-doctor-page`}>Delete Doctor</Link></a>
        </div>
      </div>

      <div className="dropdown">
        <a href="#">Medical Record ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/search-patient-records-for-hospital`}>Read Patient Medical Records</Link></a>
          <a><Link to={`/create-record-page-for-hospital`}>Create Patient Medical Records</Link></a>
          <a><Link to={`/update-record-page-for-hospital`}>Update Patient Medical Records</Link></a>
        </div>
      </div>

      <div className="dropdown">
        <a href="#">Hospital ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/read-all-hospitals`}>View All Hospital</Link></a>
          <a><Link to={`/read-hospital-page-for-hospital`}>Search Hospital</Link></a>
        </div>
      </div>

      <div className="dropdown">
        <a href="#">History ⌄</a>
        <div className="dropdown-content">
          <a><Link to={`/history`}>Update History</Link></a>
        </div>
      </div>

      <div className="welcome-message">
        Welcome, {user.UserType} {user.Username}
      </div>
    </div>
  );
};

export default HospitalPageHeader;




