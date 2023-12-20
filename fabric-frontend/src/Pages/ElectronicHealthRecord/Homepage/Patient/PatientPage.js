// PatientPage.js
import React, { useState } from 'react';
import PatientHeader from '../Component/PatientHeader';
import BodySlider from '../Component/BodySlider';
import Footer from '../Component/Footer';
import '../../../CSS/Patient/PatientPage.css';

function PatientPage() {
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
      <PatientHeader onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <BodySlider />
      <Footer />
    </div>
  );
}

export default PatientPage;
