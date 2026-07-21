import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSect.scss';
import img1 from '../../../assets/faq-hero.png';
import img2 from '../../../assets/faq-hero2.jpg';

interface Slide {
  image: string;
  title: string;
  text: React.ReactNode;
}

const slides: Slide[] = [
  {
    image: img1,
    title: 'FAQs.',
    text: (
      <>
        <Link to="/">Home</Link> / FAQs
      </>
    ),
  },
  {
    image: img2,
    title: 'Need Help?',
    text: (
      <>
        Find answers to common questions about membership, employer registration,
        contributions, claims, healthcare providers, benefits, and online services.
      </>
    ),
  },
];

const HeroSect: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div
        key={current} // for animation reset
        className="hero-slide"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="hero-text">
          <h1>{slides[current].title}</h1>
          <p>{slides[current].text}</p>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? 'dot active' : 'dot'}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSect;