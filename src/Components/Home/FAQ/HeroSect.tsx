import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/" className="text-[#f4b400] font-semibold no-underline hover:underline">
          Home
        </Link>{' '}
        / FAQs
      </>
    ),
  },
  {
    image: img2,
    title: 'Need Help?',
    text: 'Find answers to common questions about membership, employer registration, contributions, claims, healthcare providers, benefits, and online services.',
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
    <section className="relative w-full h-[60vh] min-h-[420px] overflow-hidden text-white">
      <div
        key={current}
        className="absolute inset-0 flex items-center bg-cover bg-center bg-no-repeat animate-[heroFade_0.8s_ease]
          before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.5)_100%)]"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="relative z-[1] max-w-[720px] mx-auto px-6 text-center">
          <h1 className="font-['Sora','Segoe_UI',sans-serif] text-[clamp(2.2rem,5vw,3.4rem)] font-bold mb-3">
            {slides[current].title}
          </h1>
          <p className="text-[1.05rem] leading-[1.6] text-white/88">
            {slides[current].text}
          </p>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-[3] flex justify-center gap-2.5">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              index === current ? 'bg-white scale-[1.2]' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSect;