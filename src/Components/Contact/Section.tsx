import React, { useState, useEffect } from 'react'
import './Section.scss'
import img1 from "../../assets/Careers-Thumbnails2.jpg";
import img4 from "../../assets/Careers-Thumbnails3.jpg";
import { Link } from 'react-router-dom'
interface Slide {
  image: string
  title: string
  text: string
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
