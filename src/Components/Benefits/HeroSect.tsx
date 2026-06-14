import React, { useState, useEffect } from 'react'
import './HeroSect.scss'
import img1 from "../../assets/Careers-Thumbnails.jpg";
import img4 from "../../assets/Careers-Thumbnails2.jpg";
interface Slide {
  image: string
  title: string
  text: string
}

const slides: Slide[] = [
  {
    image: img4,
    title: 'Benefits.',
    text: 'Home / Benefits'
  },
  {
    image: img1,
    title: '',
    text: '.'
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
