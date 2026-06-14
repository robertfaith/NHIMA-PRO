import { useEffect, useState, useRef } from 'react'
import Logo from '../../../assets/2.png'
import slide1 from '../../../assets/p4.jpg'
import slide2 from '../../../assets/p6.jpg'
import slide3 from '../../../assets/p7.webp'
import slide4 from '../../../assets/p3.png'
import slide5 from '../../../assets/p21.jpg'

// icons for the slides
import { BsHospital } from "react-icons/bs"
import { MdGroups2 } from "react-icons/md"
import { FcMoneyTransfer } from "react-icons/fc"

const slides = [
  {
    image: slide1,
    title: 'Access Quality Healthcare',
    badge: (
      <>
        <BsHospital size={16} style={{ marginRight: 6 }} />
        Healthcare Access
      </>
    ),
    message:
      'With NHIMA, you and your family get access to quality medical services at accredited health facilities across Zambia — without worrying about the cost.',
  },
  {
    image: slide2,
    title: 'Protect Your Family',
    badge: (
      <>
        <MdGroups2 size={16} style={{ marginRight: 6 }} />
        Family Protection
      </>
    ),
    message:
      'Your NHIMA membership covers your spouse and children. One contribution protects your entire household from unexpected medical bills.',
  },
  {
    image: slide3,
    title: 'Simple Contributions',
    badge: (
      <>
        <FcMoneyTransfer size={16} style={{ marginRight: 6 }} />
        Affordable
      </>
    ),
    message:
      'Just 1% of your salary. That small monthly contribution unlocks comprehensive health insurance benefits for you and your entire family.',
  },
  {
    image: slide4,
    title: 'Nationwide Coverage',
    badge: <>📍 Nationwide</>,
    message:
      'From Lusaka to Livingstone, Ndola to Mansa — NHIMA-accredited facilities are available across all 10 provinces of Zambia.',
  },
  {
    image: slide5,
    title: 'Your Right as a Worker',
    badge: <>⚖️ Your Right</>,
    message:
      'Health insurance is your right under the National Health Insurance Act No. 2 of 2018.',
  },
]

const RegisterLeft = () => {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFading(true)

      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setFading(false)
      }, 600)
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const goTo = (index: number) => {
    if (index === current) return

    setFading(true)

    timeoutRef.current = setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 600)
  }

  const slide = slides[current]

  return (
    <div
      style={{
        width: '50%',
        height: '100vh',
        background: '#002B5B',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '40px',
          zIndex: 10,
        }}
      >
        <img
          src={Logo}
          alt="NHIMA Logo"
          style={{
            width: '140px',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Slider */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={slide.image}
          alt={slide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity .7s ease',
            opacity: fading ? 0.3 : 1,
          }}
        />

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,20,60,.95), rgba(0,20,60,.45), rgba(0,20,60,.15))',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '40px',
            right: '40px',
            color: '#fff',
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,.12)',
              marginBottom: '12px',
              fontSize: '12px',
            }}
          >
            {slide.badge}
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            {slide.title}
          </h2>

          <p
            style={{
              lineHeight: 1.7,
              maxWidth: '420px',
              color: 'rgba(255,255,255,.85)',
            }}
          >
            {slide.message}
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '25px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>1M+</h3>
              <p style={{ fontSize: '12px' }}>Members</p>
            </div>

            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>500+</h3>
              <p style={{ fontSize: '12px' }}>Facilities</p>
            </div>

            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>10</h3>
              <p style={{ fontSize: '12px' }}>Provinces</p>
            </div>
          </div>

          {/* Dots */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '30px',
            }}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                style={{
                  width: index === current ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  background:
                    index === current
                      ? '#fff'
                      : 'rgba(255,255,255,.35)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterLeft