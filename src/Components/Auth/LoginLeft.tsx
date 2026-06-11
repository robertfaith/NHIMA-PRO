import Logo from '../../assets/2.png'


const logoImageStyles: React.CSSProperties = {
  maxWidth: '100px',
  height: 'auto',
  marginLeft: '8px',
  borderRadius: '2px',
  padding: '6px',
};

const LoginLeft = () => {
  return (
    <div className='hidden md:flex w-1/2 bg-indigo relative overflow-hidden border-r border-slate-200'>
        <div className="absolute -top-30 -left-30 w-72 h-72 bg-indigo-500/20 round-full blur-3xl"></div>
        <div className='relative z-10 flex flex-col item-start justify-center p-12 lg:p-20 w-full h-full'>

            <img src={Logo} alt="Logo" style={logoImageStyles} />
            <h1 className='text-4xl lg:text5xl font-medium text-white mb-6 leading-tight tracking-tight'>Employer<br /> MANAGEMENT SYSTEM</h1>
            <p className='text-slate-400 text-lg max-w-md leading-relaxed'>Make contributions, and manage your employees through healthy systems.</p>
        </div>

    </div>
  )
}

export default LoginLeft