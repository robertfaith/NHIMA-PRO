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
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    Axios.post<{ message: string }>(`${API}/api/users/login`, {
      email: values.email,
      password: values.password
    }, { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message || 'Login successful!')
        navigate('/memdashboard')
      })
      .catch((error) => {
        console.error('Login failed:', error)
        setMessage(error.response?.data?.error || 'Invalid email or password.')
      })
  }

  return (
    <div className='loginPage flex'>
      <div className="container flex">

        {/* Left side with video */}
        <div className="videoDev">
          <video src={video} autoPlay muted loop />
          <div className="textDiv">
            <h2 className='title'>
              Your partner in growth and security.
            </h2>
            <p>Live your Dream</p>
          </div>
        </div>

        {/* Right side with form */}
        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Logo} alt="Logo" />
            <h3>Welcome back!</h3>
          </div>

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

          <span className='forgotPassword'>
            Forgot Password? <Link to="/register">Click here</Link>
          </span>

          <div className="footerDiv">
            <span className='text'>Don&apos;t have an account?</span>
            <Link to={'/register'}>
              <button className='btn'>Sign up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
