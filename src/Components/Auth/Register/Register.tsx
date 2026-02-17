import { useState } from 'react'
import './Register.css'
import video from '../../../assets/video.mp4'
import { Link } from 'react-router-dom'
import Logo from '../../../assets/AB_Bank_Logo.png'
import { FaUserShield } from "react-icons/fa6"
import { BsFillShieldLockFill } from "react-icons/bs"
import { AiOutlineSwapRight } from "react-icons/ai"
import Axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:1999'
const Register: React.FC = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // Handle user registration
  const createUser = () => {
    Axios.post(`${API}/api/users/register`, {
      email,
      username,
      password
    }, { withCredentials: true })
      .then(() => {
        setMessage('✅ Account has been created successfully!')
      })
      .catch((error) => {
        console.error('Error creating account:', error)
        setMessage('❌ Failed to create account. Please try again.')
      })
  }

  return (
    <div className='registerPage flex'>
      <div className="container flex">
        
        {/* Left Side with Video */}
        <div className="videoDev">
          <video src={video} autoPlay muted loop />
          <div className="textDiv">
            <h2 className='title'>
              The College that's ambitious and passionate to impart skills in vibrant youths
            </h2>
            <p>Live your Dream</p>
          </div>
        </div>

        {/* Right Side with Form */}
        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Logo} alt="Logo" />
            <h3>Create your account</h3>
          </div>

          <form
            className='form grid'
            onSubmit={(e) => {
              e.preventDefault()
              createUser()
            }}
          >
            {message && <p className='notice'>{message}</p>}

            <div className="inputDiv">
              <div className="input flex">
                <FaUserShield className='icon' />
                <input
                  type="email"
                  placeholder='Enter your Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <div className="input flex">
                <FaUserShield className='icon' />
                <input
                  type="text"
                  placeholder='Enter Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type='submit' className='btn flex items-center gap-2'>
              <span>Register</span>
              <AiOutlineSwapRight className='icon' />
            </button>
          </form>

          <span className='forgotPassword'>
            Forgot Password? <Link to="/login">Click here</Link>
          </span>

          <div className="footerDiv">
            <span className='text'>Already have an account?</span>
            <Link to={'/login'}>
              <button className='btn'>Sign In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
