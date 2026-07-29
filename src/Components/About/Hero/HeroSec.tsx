import React, { useState, useEffect } from 'react';
import img1 from "../../../assets/Q121.jpg";
import img4 from "../../../assets/Q4.jpeg";

interface Slide {
  image: string;
  title: string;
  text: string;
}

const slides: Slide[] = [
  {
    image: img4,
    title: 'Affordable Health Insurance for Every Zambian',
    text: 'Access quality healthcare services nationwide through the National Health Insurance Scheme.'
  },
  {
    image: img1,
    title: 'About NHIMA',
    text: 'NHIMA is committed to providing accessible, affordable, and quality healthcare services to all Zambians.'
  }
];

const HeroSec: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[45vh] sm:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden font-['Poppins',sans-serif] text-white">
      <div
        key={current}
        className="relative w-full min-h-[45vh] sm:min-h-[55vh] lg:min-h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center transition-[background-image] duration-[800ms] ease-in-out
          before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(0,32,96,0.75),rgba(0,32,96,0.6))] before:z-[1]"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="relative z-[2] max-w-[800px] px-5 py-[1.3rem] sm:px-8 sm:py-[1.8rem] lg:px-12 lg:py-8 text-center bg-white/[0.08] backdrop-blur-[6px] rounded-[10px] sm:rounded-[14px] shadow-[0_12px_30px_rgba(0,0,0,0.25)] animate-hero-fade-up">
          <h1 className="text-[1.4rem] sm:text-[clamp(1.5rem,4vw,2.8rem)] font-bold mb-4 tracking-[0.5px]">
            {slides[current].title}
          </h1>
          <p className="text-[0.95rem] sm:text-[clamp(1rem,2vw,1.2rem)] leading-[1.6] opacity-95">
            {slides[current].text}
          </p>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[2] flex gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              index === current ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSec;