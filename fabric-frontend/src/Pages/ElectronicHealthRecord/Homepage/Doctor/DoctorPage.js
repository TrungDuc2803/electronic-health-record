// PatientPage.js
import React, { useState } from 'react';
import DoctorPageHeader from '../Component/DoctorPageHeader';
import BodySlider from '../Component/BodySlider';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';

function DoctorPage() {
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="patient-page">
      <DoctorPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <BodySlider />
      <Footer />
    </div>
  );
}

export default DoctorPage;
