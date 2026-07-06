import './testimonials.scss';
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

import User_1 from '../../assets/reg.jpg';
import User_2 from '../../assets/regist.jpg';
import User_3 from '../../assets/simbeye.jpg';
import User_4 from '../../assets/hero.png';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    image: User_1,
    name: "Naomi Nyirongo",
    location: "LBTC, Lusaka",
    text: "Choosing to run my business with a bank that empowers youths and women has been one of my best decisions. AB Bank has provided excellent services and support that continue to help my business grow."
  },
  {
    image: User_2,
    name: "Racheal Phiri",
    location: "LBTC, Lusaka",
    text: "AB Bank has given me confidence and financial support to expand my business. Their customer service and commitment to empowering women are truly remarkable."
  },
  {
    image: User_3,
    name: "Nicholas Pikiti",
    location: "Libala, Lusaka",
    text: "Working with AB Bank has helped me improve cash flow management and grow my small business. I highly recommend their services to entrepreneurs."
  },
  {
    image: User_4,
    name: "Blessings Makasa",
    location: "Woodlands, Lusaka",
    text: "The support and financial products offered by AB Bank have enabled me to achieve my business goals faster than I expected. Their service is exceptional."
  }
];

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerPage(window.innerWidth < 768 ? 1 : 2);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / cardsPerPage);

  const nextSlide = () => {
    setCurrentPage(prev =>
      prev === totalPages - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentPage(prev =>
      prev === 0 ? totalPages - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentPage, totalPages]);

  return (
    <div className="testimonials">

      <GrFormPreviousLink
        className="back-btn"
        onClick={prevSlide}
      />

      <GrFormNextLink
        className="next-btn"
        onClick={nextSlide}
      />

      <div className="slider">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${currentPage * 100}%)`
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div className="slide-page" key={pageIndex}>
              {testimonials
                .slice(
                  pageIndex * cardsPerPage,
                  pageIndex * cardsPerPage + cardsPerPage
                )
                .map((item, index) => (
                  <div className="slide" key={index}>
                    <div className="user-info">
                      <img src={item.image} alt={item.name} />

                      <div>
                        <h3>{item.name}</h3>
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <p>{item.text}</p>

                    <div className="rating">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="dots">
        {Array.from({ length: totalPages }).map((_, index) => (
          <span
            key={index}
            className={
              currentPage === index
                ? 'dot active'
                : 'dot'
            }
          />
        ))}
      </div>

    </div>
  );
};

export default Testimonials;