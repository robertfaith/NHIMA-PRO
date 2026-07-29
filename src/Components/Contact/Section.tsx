import React, { useState, useEffect } from 'react';
import img1 from "../../assets/Careers-Thumbnails2.jpg";
import img4 from "../../assets/Careers-Thumbnails3.jpg";
import { Link } from 'react-router-dom';

interface Slide {
  image: string;
  title: string;
  text: React.ReactNode;
}

const slides: Slide[] = [
  {
    image: img4,
    title: 'Contact Us.',
    text: (
      <>
        <Link to="/">Home</Link> / Contact
      </>
    )
  },
  {
    image: img1,
    title: 'Contact',
    text: (
      <>
        Talk to us about your needs and we will get back to you as soon as possible.
      </>
    )
  }
];

const HeroSect: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero relative">
      <div
        key={current}
        className="hero-slide"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="hero-text">
          <h1>{slides[current].title}</h1>
          <p>{slides[current].text}</p>
        </div>
      </div>

      <div className="absolute bottom-5 flex gap-2.5 z-[3]">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              index === current ? 'bg-white scale-[1.2]' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSect;