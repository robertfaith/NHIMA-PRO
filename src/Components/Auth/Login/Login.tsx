<<<<<<< HEAD
import { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/2.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { saveTokens } from '../../utils/auth'   // ← adjust path to where you put auth.ts
import './Login.scss'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:9901'

type Tab = 'employers' | 'members' | 'agents'

// Tab → role value sent to backend
const TAB_ROLE: Record<Tab, string> = {
  employers: 'EMPLOYER',
  members:   'MEMBER',
  agents:    'AGENT',
}

// Role → redirect after login
const ROLE_REDIRECT: Record<string, string> = {
  ADMIN:    '/admin',
  EMPLOYER: '/dashboard',
  AGENT:    '/dashboard',
  MEMBER:   '/dashboard',
}

const Login = () => {
  const [activeTab,    setActiveTab]    = useState<Tab>('members')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [message,      setMessage]      = useState('')

  const [values, setValues] = useState({
    employerAccountNumber: '',
    email:                 '',
    memberId:              '',
    phoneNumber:           '',
    password:              '',
  })

  const navigate = useNavigate()

  // Reset form on tab switch
  useEffect(() => {
    setValues({ employerAccountNumber: '', email: '', memberId: '', phoneNumber: '', password: '' })
    setMessage('')
    setShowPassword(false)
  }, [activeTab])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // ── Build payload ─────────────────────────────────────────────────────────
    // Backend login reads: { email, password, role }
    let payload: Record<string, string> = {
      role:     TAB_ROLE[activeTab],
      password: values.password,
    }

    if (activeTab === 'employers') {
      payload = {
        ...payload,
        employerAccountNumber: values.employerAccountNumber,
        email:                 values.email,
      }
    }

    if (activeTab === 'members') {
      payload = { ...payload, memberId: values.memberId }
    }

    if (activeTab === 'agents') {
      payload = { ...payload, phoneNumber: values.phoneNumber }
    }

    try {
      // POST /api/auth/login
      // Response: { success, message, data: { accessToken, refreshToken, user } }
      const { data: res } = await axios.post(`${API}/api/auth/login`, payload)

      const { accessToken, refreshToken, user } = res.data

      // Persist tokens + role so Sidebar & api instance can use them
      saveTokens(accessToken, refreshToken, user.role)

      // Redirect by role
      navigate(ROLE_REDIRECT[user.role] ?? '/dashboard', { replace: true })

    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Invalid credentials. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const TAB_TITLE: Record<Tab, string> = {
    employers: 'Employer Portal',
    members:   'Member Portal',
    agents:    'Agent Portal',
  }

  const TAB_HINT: Record<Tab, string> = {
    employers: 'Sign in with your Employer Account Number and Email',
    members:   'Sign in with your NHIMA Member ID',
    agents:    'Sign in with your registered Phone Number',
  }

  return (
    <div className="login-panel">

      <div className="login-bubble login-bubble--tr" />
      <div className="login-bubble login-bubble--bl" />
      <div className="login-bubble login-bubble--mr" />

      <div className="login-inner">

        <div className="login-logo">
          <img src={Logo} alt="NHIMA Logo" />
        </div>

        <div className="login-card">

          <div className="login-welcome">
            <h2>{TAB_TITLE[activeTab]}</h2>
            <p>{TAB_HINT[activeTab]}</p>
          </div>

          <div className="login-tabs">
            {(['employers', 'members', 'agents'] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`login-tab ${activeTab === tab ? 'login-tab--active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {message && (
            <div className="login-error" role="alert">{message}</div>
          )}

          <form onSubmit={handleLogin} className="login-form">

            {activeTab === 'employers' && (
              <>
                <input
                  type="text"
                  placeholder="Employer Account Number"
                  className="login-input"
                  value={values.employerAccountNumber}
                  onChange={(e) => setValues({ ...values, employerAccountNumber: e.target.value })}
                  required
                  autoComplete="username"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="login-input"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </>
            )}

            {activeTab === 'members' && (
              <input
                type="text"
                placeholder="Member ID  (e.g. MEM-2026-000042)"
                className="login-input"
                value={values.memberId}
                onChange={(e) => setValues({ ...values, memberId: e.target.value })}
                required
                autoComplete="username"
              />
            )}

            {activeTab === 'agents' && (
              <input
                type="tel"
                placeholder="Phone Number  (e.g. 0977000000)"
                className="login-input"
                value={values.phoneNumber}
                onChange={(e) => setValues({ ...values, phoneNumber: e.target.value })}
                required
                autoComplete="tel"
              />
            )}

            <div className="login-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="login-input"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>

            <div className="login-links">
              <Link to="/forgot-password" className="login-link">Forgot Password?</Link>
              <Link to="/register"        className="login-link">Need an account? Sign up</Link>
            </div>

          </form>
=======
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

>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
        </div>
      </div>
    </div>
  )
}

export default Login
