// PatientPage.js
import React, { useState } from 'react';
import HospitalPageHeader from '../Component/HospitalPageHeader';
import BodySlider from '../Component/BodySlider';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';

function HospitalPage() {
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
      <HospitalPageHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <BodySlider />
      <Footer />
    </div>
  );
}

export default HospitalPage;
