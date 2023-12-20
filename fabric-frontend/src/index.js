import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import CreateAsset from './Pages/createAsset';
import UpdateAsset from './Pages/updateAsset';
import ReadAllAssets from './Pages/readAllAssets';
import ReadAsset from './Pages/readAsset';
import DeleteAsset from './Pages/DeleteAsset';
import CreatePatient from './Pages/ElectronicHealthRecord/Patient/createPatient';
import ReadAllPatients from './Pages/ElectronicHealthRecord/Patient/readAllPatients';
import ReadPatient from './Pages/ElectronicHealthRecord/Patient/readPatient';
import UpdatePatient from './Pages/ElectronicHealthRecord/Patient/updatePatient';
import DeletePatient from './Pages/ElectronicHealthRecord/Patient/deletePatient';
import DeletePatientPage from './Pages/ElectronicHealthRecord/Homepage/Hospital/Patient/deletePatientPage';
import ReadAllDoctors from './Pages/ElectronicHealthRecord/Doctor/readAllDoctors';
import CreateDoctor from './Pages/ElectronicHealthRecord/Doctor/createDoctor';
import ReadDoctor from './Pages/ElectronicHealthRecord/Doctor/readDoctor';
import UpdateDoctor from './Pages/ElectronicHealthRecord/Doctor/updateDoctor';
import DeleteDoctor from './Pages/ElectronicHealthRecord/Doctor/deleteDoctor';
import DeleteDoctorPage from './Pages/ElectronicHealthRecord/Homepage/Hospital/Doctor/deleteDoctorPage';
import ReadAllRecords from './Pages/ElectronicHealthRecord/MedicalRecord/readAllRecords';
import CreateRecord from './Pages/ElectronicHealthRecord/MedicalRecord/createRecord';
import ReadRecord from './Pages/ElectronicHealthRecord/MedicalRecord/readRecord';
import UpdateRecord from './Pages/ElectronicHealthRecord/MedicalRecord/updateRecord';
import Login from './Pages/ElectronicHealthRecord/Login/login';
import { UserProvider } from './Pages/ElectronicHealthRecord/Login/UserContext';
import PatientPage from './Pages/ElectronicHealthRecord/Homepage/Patient/PatientPage';
import DoctorPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/DoctorPage';
import HospitalPage from './Pages/ElectronicHealthRecord/Homepage/Hospital/HospitalPage';
import ViewPatientProfile from './Pages/ElectronicHealthRecord/Homepage/Patient/viewPatientProfile';
import ViewDoctorProfile from './Pages/ElectronicHealthRecord/Homepage/Doctor/viewDoctorProfile';
import UpdatePatientPage from './Pages/ElectronicHealthRecord/Homepage/Patient/UpdatePatientPage';
import UpdatePatientPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/Patient/UpdatePatientPageForHospital';
import UpdateDoctorPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/updateDoctorPage';
import UpdateDoctorPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/Doctor/updateDoctorPageForHospital';
import UpdateRecordPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/updateRecordPage';
import UpdateRecordPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/MedicalRecord/updateRecordPageForHospital';
import ReadAllPatientsPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/readAllPatientsPage';
import ReadAllPatientsPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/Patient/readAllPatientsPageForHospital';
import ReadAllDoctorsPageForPatient from './Pages/ElectronicHealthRecord/Homepage/Patient/readAllDoctorsPageForPatient';
import ReadAllDoctorsPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/readAllDoctorsPage';
import ReadAllDoctorsPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/Doctor/readAllDoctorsPageForHospital';
import ReadAllRecordsByPatientID from './Pages/ElectronicHealthRecord/Homepage/Patient/readAllRecordsByPatientID';
import ReadAllRecordsByPatientIDForDoc from './Pages/ElectronicHealthRecord/Homepage/Doctor/readAllRecordsByPatientIDForDoc';
import ReadAllRecordsByPatientIDForHos from './Pages/ElectronicHealthRecord/Homepage/Hospital/MedicalRecord/readAllRecordsByPatientIDForHos';
import ReadAllHospitalsPage from './Pages/ElectronicHealthRecord/Homepage/Hospital/Hospital/readAllHospitalsPage';
import ReadPatientPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/readPatientPage';
import ReadPatientPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/Patient/readPatientPageForHospital';
import ReadDoctorPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/readDoctorPage';
import ReadDoctorPageForPatient from './Pages/ElectronicHealthRecord/Homepage/Patient/readDoctorPageForPatient';
import ReadHospitalPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/Hospital/readHospitalPageForHospital';
import CreateRecordPage from './Pages/ElectronicHealthRecord/Homepage/Doctor/createRecordPage';
import CreateRecordPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/MedicalRecord/createRecordPageForHospital';
import CreatePatientPage from './Pages/ElectronicHealthRecord/Homepage/Hospital/Patient/createPatientPage';
import CreateDoctorPage from './Pages/ElectronicHealthRecord/Homepage/Hospital/Doctor/createDoctorPage';
import ReadAllLogChanges from './Pages/ElectronicHealthRecord/Homepage/Hospital/readAllLogChanges';
import reportWebVitals from './reportWebVitals';
import ReadDoctorPageForHospital from './Pages/ElectronicHealthRecord/Homepage/Hospital/Doctor/readDoctorPageForHospital';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/create-asset" element={<CreateAsset />} />
        <Route path="/read-all-assets" element={<ReadAllAssets />} />
        <Route path="/update-asset" element={<UpdateAsset />} />
        <Route path="/read-asset" element={<ReadAsset />} />
        <Route path="/delete-asset" element={<DeleteAsset />} />
        {/* Define more routes for other pages */}
        {/* Patient */}
        <Route path="/create-patient" element={<CreatePatient />} />
        <Route path="/read-all-patients" element={<ReadAllPatients />} />
        <Route path="/read-patient" element={<ReadPatient />} />
        <Route path="/update-patient" element={<UpdatePatient />} />
        <Route path="/delete-patient" element={<DeletePatient />} />
        {/* Doctor */}
        <Route path="/read-all-doctors" element={<ReadAllDoctors />} />
        <Route path="/create-doctor" element={<CreateDoctor />} />
        <Route path="/read-doctor" element={<ReadDoctor />} />
        <Route path="/update-doctor" element={<UpdateDoctor />} />
        <Route path="/delete-doctor" element={<DeleteDoctor />} />
        {/* Medical Record */}
        <Route path="/read-all-records" element={<ReadAllRecords />} />
        <Route path="/create-record" element={<CreateRecord />} />
        <Route path="/read-record" element={<ReadRecord />} />
        <Route path="/update-record" element={<UpdateRecord />} />
        {/* Patient pages */}
        <Route path="/patient-homepage" element={<PatientPage />} />
        <Route path="/view-patient-profile/:userID" element={<ViewPatientProfile />} />
        <Route path="/update-patient-profile/:userID" element={<UpdatePatientPage />} />
        <Route path="/read-patient-records/:userID" element={<ReadAllRecordsByPatientID />} />
        <Route path="/read-all-doctors-page-for-patient" element={<ReadAllDoctorsPageForPatient />} />
        <Route path="/read-doctor-page-for-patient" element={<ReadDoctorPageForPatient />} />
        {/* Doctor pages */}
        <Route path="/doctor-homepage" element={<DoctorPage />} />
        <Route path="/read-all-patients-page" element={<ReadAllPatientsPage />} />
        <Route path="/read-patient-page" element={<ReadPatientPage />} />
        <Route path="/search-patient-records/" element={<ReadAllRecordsByPatientIDForDoc />} />
        <Route path="/view-doctor-profile/:userID" element={<ViewDoctorProfile />} />
        <Route path="/update-doctor-profile/:userID" element={<UpdateDoctorPage />} />
        <Route path="/read-all-doctors-page" element={<ReadAllDoctorsPage />} />
        <Route path="/read-doctor-page" element={<ReadDoctorPage />} />
        <Route path="/create-record-page" element={<CreateRecordPage />} />
        <Route path="/update-record-page" element={<UpdateRecordPage />} />
        {/* Hospital pages */}
        <Route path="/hospital-homepage" element={<HospitalPage />} />
        <Route path="/create-patient-page" element={<CreatePatientPage />} />
        <Route path="/history" element={<ReadAllLogChanges />} />
        <Route path="/read-all-patients-page-for-hospital" element={<ReadAllPatientsPageForHospital />} />
        <Route path="/read-patient-page-for-hospital" element={<ReadPatientPageForHospital />} />
        <Route path="/update-patient-profile-for-hospital/:userID" element={<UpdatePatientPageForHospital />} />
        <Route path="/delete-patient-page" element={<DeletePatientPage />} />
        <Route path="/read-all-doctors-page-for-hospital" element={<ReadAllDoctorsPageForHospital />} />
        <Route path="/read-doctor-page-for-hospital" element={<ReadDoctorPageForHospital />} />
        <Route path="/create-doctor-page" element={<CreateDoctorPage />} />
        <Route path="/update-doctor-profile-for-hospital/:userID" element={<UpdateDoctorPageForHospital />} />
        <Route path="/delete-doctor-page" element={<DeleteDoctorPage />} />
        <Route path="/search-patient-records-for-hospital/" element={<ReadAllRecordsByPatientIDForHos />} />
        <Route path="/create-record-page-for-hospital" element={<CreateRecordPageForHospital />} />
        <Route path="/update-record-page-for-hospital" element={<UpdateRecordPageForHospital />} />
        <Route path="/read-all-hospitals" element={<ReadAllHospitalsPage />} />
        <Route path="/read-hospital-page-for-hospital" element={<ReadHospitalPageForHospital/>} />
      </Routes>
    </Router>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();