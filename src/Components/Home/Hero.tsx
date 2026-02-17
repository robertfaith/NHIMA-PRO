import './Hero.scss'
import React, { useState, useEffect } from 'react'

// Import your images
import img1 from '../../assets/furniture.png'
import img2 from '../../assets/slide2.jpg'
import img3 from '../../assets/regist.jpg'
import img4 from '../../assets/Our_ATM.jfif'

const slides = [
  {
    image: img4,
    title: 'Affordable Health Insurance for Every Zambian',
    text: 'Access quality healthcare services nationwide through National Health Insurance Scheme.'
  },
  {
    image: img1,
    title: 'Welcome to AB BANK',
    text: 'AB Bank is committed to empowering individuals, small businesses, and entrepreneurs in Zambia with reliable, affordable, and accessible financial services. Our mission is to provide innovative banking solutions that help you grow and achieve your goals.'
  },
  {
    image: img2,
    title: 'Fast & Secure Loans',
    text: 'Get approved quickly and securely'
  },
  {
    image: img3,
    title: 'Easy Money Transfers',
    text: 'Send money anywhere, anytime'
  }
]

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero">
      <div
        className="hero-slide"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="hero-text">
          <h1>{slides[current].title}</h1>
          <p>{slides[current].text}</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
