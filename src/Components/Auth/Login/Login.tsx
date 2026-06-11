import { useState } from 'react'
import './Login.scss'
import video from '../../../assets/video.mp4'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../assets/2.png'
import { FaUserShield } from "react-icons/fa6"
import { BsFillShieldLockFill } from "react-icons/bs"
import { AiOutlineSwapRight } from "react-icons/ai"
import Axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:1999'

const Login: React.FC = () => {

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [tempToken, setTempToken] = useState('')
  const [otp, setOtp] = useState('')

  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    Axios.post(`${API}/api/users/login`, {
      email: values.email,
      password: values.password
    }, {
      withCredentials: true
    })
      .then((response) => {
        setTempToken(response.data.tempToken)
        setStep('otp')
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.error ||
          "Invalid email or password"
        )
      })
  }

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault()

    Axios.post(`${API}/api/users/verify-otp`, {
      tempToken,
      otp
    }, {
      withCredentials: true
    })
      .then(() => {
        navigate('/memdashboard')
      })
      .catch(() => {
        setMessage("Invalid OTP")
      })
  }

  return (
    <div className="loginPage">
      <div className="container">

        {/* VIDEO SECTION */}
        <div className="videoDev">
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="videoOverlay">
            <div className="overlayContent">
              <img src={Logo} alt="NHIMA Logo" />
              <h2>NHIMA Digital Health Portal</h2>
              <p>Access your health insurance services anywhere, anytime.</p>
              <div className="overlayBadge">
                <span className="dot" />
                Secure &amp; Encrypted
              </div>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="formDiv">

          <div className="headerDiv">
            <div className="logoRing">
              <img src={Logo} alt="NHIMA Logo" />
            </div>
            <h3>
              {step === 'credentials' ? 'Welcome Back' : 'Verify Identity'}
            </h3>
            <p className="subheading">
              {step === 'credentials'
                ? 'Sign in to your NHIMA account'
                : 'Enter the OTP sent to your registered contact'}
            </p>
          </div>

          {step === 'credentials' && (
            <form className="form" onSubmit={handleLogin}>

              {message && (
                <div className="notice">
                  <span>⚠</span> {message}
                </div>
              )}

              <div className="inputDiv">
                <label>NHIMA ID</label>
                <div className="input">
                  <FaUserShield className="icon" />
                  <input
                    type="text"
                    placeholder="Enter your NHIMA ID"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="inputDiv">
                <label>Password</label>
                <div className="input">
                  <BsFillShieldLockFill className="icon" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn">
                Sign In
                <AiOutlineSwapRight className="btnIcon" />
              </button>

            </form>
          )}

          {step === 'otp' && (
            <form className="form" onSubmit={handleOtp}>

              {message && (
                <div className="notice">
                  <span>⚠</span> {message}
                </div>
              )}

              <div className="inputDiv">
                <label>One-Time Password</label>
                <input
                  className="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>

              <button type="submit" className="btn">
                Verify &amp; Continue
                <AiOutlineSwapRight className="btnIcon" />
              </button>

              <button
                type="button"
                className="btn ghost"
                onClick={() => { setStep('credentials'); setMessage('') }}
              >
                ← Back to Login
              </button>

            </form>
          )}

          <div className="footerDiv">
            <span>Don't have an account?</span>
            <Link to="/register">
              <button className="btn signup">Create Account</button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
