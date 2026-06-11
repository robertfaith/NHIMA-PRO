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

  const [values,setValues] = useState({
    email:'',
    password:''
  })

  const [message,setMessage] = useState('')
  const [step,setStep] = useState<'credentials'|'otp'>('credentials')
  const [tempToken,setTempToken] = useState('')
  const [otp,setOtp] = useState('')

  const navigate = useNavigate()


  const handleLogin = (e:React.FormEvent)=>{
    e.preventDefault()

    Axios.post(`${API}/api/users/login`,{
      email:values.email,
      password:values.password
    },
    {
      withCredentials:true
    })
    .then((response)=>{
      setTempToken(response.data.tempToken)
      setStep('otp')
    })
    .catch((error)=>{
      setMessage(
        error.response?.data?.error ||
        "Invalid email or password"
      )
    })

  }


  const handleOtp=(e:React.FormEvent)=>{
    e.preventDefault()

    Axios.post(`${API}/api/users/verify-otp`,
    {
      tempToken,
      otp
    },
    {
      withCredentials:true
    })
    .then(()=>{
      navigate('/memdashboard')
    })
    .catch(()=>{
      setMessage("Invalid OTP")
    })

  }


return(

<div className="loginPage">


<div className="container">


{/* VIDEO SECTION */}

<div className="videoDev">

<video 
src={video}
autoPlay
muted
loop
/>

<div className="videoOverlay">

<img src={Logo}/>

<h2>
NHIMA Digital Health Portal
</h2>

<p>
Access your health insurance services anywhere, anytime.
</p>

</div>

</div>



{/* FORM SECTION */}

<div className="formDiv">


<div className="headerDiv">

<img src={Logo}/>

<h3>
{
step==='credentials'
?
"Welcome Back"
:
"Verify Identity"
}
</h3>

</div>



{
step==='credentials' &&

<form 
className="form"
onSubmit={handleLogin}
>


{
message &&
<p className="notice">
{message}
</p>
}



<div className="inputDiv">

<div className="input">


<FaUserShield className="icon"/>

<input

type="email"

placeholder="Enter NHIMA Email"

value={values.email}

onChange={(e)=>

setValues({
...values,
email:e.target.value
})

}

/>


</div>


</div>




<div className="inputDiv">


<div className="input">

<BsFillShieldLockFill className="icon"/>


<input

type="password"

placeholder="Password"

value={values.password}


onChange={(e)=>

setValues({
...values,
password:e.target.value
})

}

/>


</div>


</div>



<button className="btn">

Login

<AiOutlineSwapRight/>

</button>


</form>

}



{
step==='otp' &&

<form 
className="form"
onSubmit={handleOtp}
>


<input

className="otp"

placeholder="Enter OTP"

value={otp}

onChange={(e)=>setOtp(e.target.value)}

/>


<button className="btn">

Verify OTP

</button>


</form>

}




<div className="footerDiv">


<span>
Don't have an account?
</span>


<Link to="/register">

<button className="btn signup">

Register

</button>

</Link>


</div>



</div>


</div>


</div>


)

}


export default Login