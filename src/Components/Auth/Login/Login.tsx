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
  const [values, setValues] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [tempToken, setTempToken] = useState('')
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    Axios.post<{ tempToken: string }>(`${API}/api/users/login`, {
      email: values.email,
      password: values.password
    }, { withCredentials: true })
      .then((response) => {
        setTempToken(response.data.tempToken)
        setMessage('')
        setStep('otp')
      })
      .catch((error) => {
        setMessage(error.response?.data?.error || 'Invalid email or password.')
      })
  }

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault()
    Axios.post(`${API}/api/users/verify-otp`, {
      tempToken,
      otp
    }, { withCredentials: true })
      .then(() => {
        navigate('/memdashboard')
      })
      .catch(() => {
        setMessage('Invalid or expired code. Please try again.')
      })
  }

  return (
    <div className='loginPage flex'>
      <div className="container flex">
        <div className="videoDev">
          <video src={video} autoPlay muted loop />
          <div className="textDiv">
            <h2 className='title'>Your partner in growth and security.</h2>
            <p>Live your Dream</p>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Logo} alt="Logo" />
            <h3>{step === 'credentials' ? 'Welcome back!' : 'Verify your identity'}</h3>
          </div>

          {step === 'credentials' && (
            <form className='form grid' onSubmit={handleLogin}>
              {message && <p className="notice">{message}</p>}
              <div className="inputDiv">
                <div className="input flex">
                  <FaUserShield className='icon' />
                  <input
                    type="email"
                    placeholder='Enter your Email'
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="inputDiv">
                <div className="input flex">
                  <BsFillShieldLockFill className='icon' />
                  <input
                    type="password"
                    placeholder='Enter Password'
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type='submit' className='btn flex items-center gap-2'>
                <span>Login</span>
                <AiOutlineSwapRight className='icon' />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form className='form grid' onSubmit={handleOtp}>
              {message && <p className="notice">{message}</p>}
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                A 6-digit code was sent to your email. It expires in 5 minutes.
              </p>
              <div className="inputDiv">
                <div className="input flex">
                  <BsFillShieldLockFill className='icon' />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder='Enter 6-digit code'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <button type='submit' className='btn flex items-center gap-2'>
                <span>Verify Code</span>
                <AiOutlineSwapRight className='icon' />
              </button>
              <span
                className='forgotPassword'
                style={{ cursor: 'pointer' }}
                onClick={() => { setStep('credentials'); setMessage(''); setOtp('') }}
              >
                ← Back to login
              </span>
            </form>
          )}

          {step === 'credentials' && (
            <>
              <span className='forgotPassword'>
                Forgot Password? <Link to="/register">Click here</Link>
              </span>
              <div className="footerDiv">
                <span className='text'>Don&apos;t have an account?</span>
                <Link to={'/register'}>
                  <button className='btn'>Sign up</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login