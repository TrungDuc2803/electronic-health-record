// BodySlider.js
import React, { useState } from 'react';
import '../../../CSS/Patient/PatientPage.css';
import hospitalImage1 from '../../../Images/hospital1.png';
import hospitalImage2 from '../../../Images/hospital2.png';
import hospitalImage3 from '../../../Images/hospital3.png';

function BodySlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    hospitalImage1,
    hospitalImage2,
    hospitalImage3,
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? images.length - 1 : prevSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === images.length - 1 ? 0 : prevSlide + 1));
  };

  return (
    <div className="body">
      <div className="slider">
        <div className="slide" style={{ backgroundImage: `url(${images[currentSlide]})` }}>
          <button className="arrow left-arrow" onClick={handlePrevSlide}>
            &lt;
          </button>
          <button className="arrow right-arrow" onClick={handleNextSlide}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodySlider;
