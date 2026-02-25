import React, { useState, useEffect } from 'react'
import './HeroSection.scss'
import img1 from "../../assets/Q4.jpeg";
import img4 from "../../assets/Q2.jpg";
interface Slide {
  image: string
  title: string
  text: string
}

const slides: Slide[] = [
  {
    image: img4,
    title: 'Our Facilities Offers Quality Services.',
    text: 'Home / Facility'
  },
  {
    image: img1,
    title: 'Facilities',
    text: 'NHIMA cares about your career and we are ready to provide professional Careers.'
  }
]

const HeroSect: React.FC = () => {
  const [current, setCurrent] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero">
      <div
        key={current}   // for animation reset
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
  )
}

export default HeroSect
