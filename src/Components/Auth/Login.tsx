import { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/2.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import './Login.scss'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:1999'

type Step = 'credentials' | 'otp'
type Tab = 'employers' | 'members' | 'agents'

const Login = () => {
  const [activeTab, setActiveTab] = useState<Tab>('members')
  const [showPassword, setShowPassword] = useState(false)

  const [values, setValues] = useState({
    employerAccountNumber: '',
    email: '',
    memberId: '',
    phoneNumber: '',
    password: '',
  })

  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<Step>('credentials')
  const [tempToken, setTempToken] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setValues({
      employerAccountNumber: '',
      email: '',
      memberId: '',
      phoneNumber: '',
      password: '',
    })

    setOtp('')
    setMessage('')
    setStep('credentials')
  }, [activeTab])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      let payload = {}

      if (activeTab === 'employers') {
        payload = {
          employerAccountNumber: values.employerAccountNumber,
          email: values.email,
          password: values.password,
        }
      }

      if (activeTab === 'members') {
        payload = {
          memberId: values.memberId,
          password: values.password,
        }
      }

      if (activeTab === 'agents') {
        payload = {
          phoneNumber: values.phoneNumber,
          password: values.password,
        }
      }

      const response = await axios.post(
        `${API}/api/users/login`,
        payload,
        { withCredentials: true }
      )

      setTempToken(response.data.tempToken)
      setStep('otp')
    } catch (error: any) {
      setMessage(
        error.response?.data?.error ||
        'Invalid credentials. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOtp = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      await axios.post(
        `${API}/api/users/verify-otp`,
        {
          tempToken,
          otp,
        },
        { withCredentials: true }
      )

      if (activeTab === 'members') {
        navigate('/memdashboard')
      }

      if (activeTab === 'employers') {
        navigate('/employerdashboard')
      }

      if (activeTab === 'agents') {
        navigate('/agentdashboard')
      }

    } catch (error: any) {
      setMessage(
        error.response?.data?.error ||
        'Invalid or expired OTP.'
      )
    } finally {
      setLoading(false)
    }
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

            <h2>
              {activeTab === 'employers' && 'Employer Portal'}
              {activeTab === 'members' && 'Member Portal'}
              {activeTab === 'agents' && 'Agent Portal'}
            </h2>

            <p>
              {activeTab === 'employers' &&
                'Login using Employer Account Number and Email'}

              {activeTab === 'members' &&
                'Login using your NHIMA Member ID'}

              {activeTab === 'agents' &&
                'Login using your registered Phone Number'}
            </p>

          </div>

          <div className="login-tabs">
            {(['employers', 'members', 'agents'] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`login-tab ${
                  activeTab === tab ? 'login-tab--active' : ''
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {message && (
            <div className="login-error">
              {message}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleLogin} className="login-form">

              {/* EMPLOYERS */}
              {activeTab === 'employers' && (
                <>
                  <input
                    type="text"
                    placeholder="Employer Account Number"
                    className="login-input"
                    value={values.employerAccountNumber}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        employerAccountNumber: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="login-input"
                    value={values.email}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </>
              )}

              {/* MEMBERS */}
              {activeTab === 'members' && (
                <input
                  type="text"
                  placeholder="Member ID"
                  className="login-input"
                  value={values.memberId}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      memberId: e.target.value,
                    })
                  }
                  required
                />
              )}

              {/* AGENTS */}
              {activeTab === 'agents' && (
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="login-input"
                  value={values.phoneNumber}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              )}

              {/* PASSWORD */}
              <div className="login-password-wrap">

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="login-input"
                  value={values.password}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button
                  type="button"
                  className="login-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-btn"
              >
                {loading ? 'Signing In...' : 'Login →'}
              </button>

              <div className="login-links">

                <Link
                  to="/forgot-password"
                  className="login-link"
                >
                  Forgot Password?
                </Link>

                <Link
                  to="/register"
                  className="login-link"
                >
                  Need an account? Sign up
                </Link>

              </div>

            </form>
          ) : (
            <form
              onSubmit={handleOtp}
              className="login-form"
            >

              <p className="login-otp-hint">
                Enter the 6-digit OTP sent to your
                registered email or phone number.
              </p>

              <input
                type="text"
                value={otp}
                maxLength={6}
                placeholder="• • • • • •"
                className="login-input login-input--otp"
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, '')
                  )
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="login-btn"
              >
                {loading
                  ? 'Verifying...'
                  : 'Verify OTP'}
              </button>

              <button
                type="button"
                className="login-btn login-btn--ghost"
                onClick={() => {
                  setStep('credentials')
                  setOtp('')
                  setMessage('')
                }}
              >
                ← Back to Login
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default Login