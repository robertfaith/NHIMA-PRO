import Loginleft from './LoginLeft'
import Login from './Login'

const Loginlanding = () => {
  return (
    <div className='h-screen w-screen flex flex-row overflow-hidden bg-gradient-to-br from-[#0A3A63] via-[#14507D] to-[#1D6FA5]'>
      <Loginleft />
      <Login />
    </div>
  )
}

export default Loginlanding