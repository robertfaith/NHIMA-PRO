import './testimonials.scss';
import { GrFormNextLink } from "react-icons/gr";
import { GrFormPreviousLink } from "react-icons/gr"; // replace with a real back icon if available
import User_1 from '../../assets/reg.jpg';
import User_2 from '../../assets/regist.jpg';
import User_3 from '../../assets/simbeye.jpg';
import User_4 from '../../assets/hero.png';

import React, { useRef, useState, useEffect } from 'react';

const Testimonials = () => {
  const slider = useRef<HTMLUListElement>(null);
  const [tx, setTx] = useState(0);

  const totalSlides = 4; // 4 testimonials
  const step = 25; // 100% / 4 slides = 25%

  const updateSlider = (newTx: number) => {
    if (slider.current) {
      slider.current.style.transform = `translateX(-${newTx}%)`;
    }
  };

  const slideForward = () => {
    let newTx = tx + step;
    if (newTx >= totalSlides * step) {
      newTx = 0; // loop to first
    }
    setTx(newTx);
    updateSlider(newTx);
  };

  const slideBackward = () => {
    let newTx = tx - step;
    if (newTx < 0) {
      newTx = (totalSlides - 1) * step; // loop to last
    }
    setTx(newTx);
    updateSlider(newTx);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      slideForward();
    }, 5000); // slide every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [tx]); // re-run when tx changes

  return (
    <div className="testimonials">
      <GrFormNextLink className="next-btn" onClick={slideForward} />
      <GrFormPreviousLink className="back-btn" onClick={slideBackward} />
      <div className="slider">
        <ul ref={slider}>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={User_1} alt="Naomi Nyirongo" />
                <div>
                  <h3>Naomi Nyirongo</h3>
                  <span>LBTC, Lusaka</span>
                </div>
              </div>
              <p>
                Choosing to run my Business with the bank that is willing to empower youths and
                women in the society, Excellence is a mandate if you run your business with AB Bank,
                It has served me to my satisfaction
              </p>
            </div>
          </li>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={User_2} alt="Racheal Phiri" />
                <div>
                  <h3>Racheal Phiri</h3>
                  <span>LBTC, Lusaka</span>
                </div>
              </div>
              <p>
                Choosing to run my Business with the bank that is willing to empower youths and
                women in the society, Excellence is a mandate if you run your business with AB Bank,
                It has served me to my satisfaction
              </p>
            </div>
          </li>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={User_3} alt="Nicholas Pikiti" />
                <div>
                  <h3>Nicholas Pikiti</h3>
                  <span>Libala, Lusaka</span>
                </div>
              </div>
              <p>
                Choosing to run my Business with the bank that is willing to empower youths and
                women in the society, Excellence is a mandate if you run your business with AB Bank,
                It has served me to my satisfaction
              </p>
            </div>
          </li>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={User_4} alt="Blessings Makasa" />
                <div>
                  <h3>Blessings Makasa</h3>
                  <span>Woodlands, Lusaka</span>
                </div>
              </div>
              <p>
                Choosing to run my Business with the bank that is willing to empower youths and
                women in the society, Excellence is a mandate if you run your business with AB Bank,
                It has served me to my satisfaction
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Testimonials;
export { Testimonials };