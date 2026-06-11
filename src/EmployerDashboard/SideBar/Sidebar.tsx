import React, {useEffect, useState} from 'react'
import {useLocation, Link} from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi"

// icons
import { SiHomebridge } from "react-icons/si";
import { PiUserCircleCheckDuotone, PiXCircleDuotone } from "react-icons/pi";
import { AiOutlineNotification } from "react-icons/ai";
import { MdOutlineSettingsSuggest, MdPolicy, MdAddHomeWork} from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaUsersCog } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { FaChevronRight } from "react-icons/fa6";




import Logo from "../../assets/2.png";

const Sidebar = () => {
  const {pathname} = useLocation()
  const [userName, setUserName] = useState<string>('Robert Mumba')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [role, setRole] = useState<string>('MEMBER')        // ← was: const role = "" || "MEMBER"

  const logoImageStyles: React.CSSProperties = {
    maxWidth: '100px',
    height: 'auto',
    marginLeft: '8px',
    borderRadius: '2px',
    padding: '6px',
  };

  useEffect(()=>{
    setUserName(userName)
  },[])

  useEffect(()=>{
    setMobileOpen(false)
  },[pathname])

  const navLinks = [
    { label: "Dashboard", icon: <SiHomebridge />, to: "/dashboard" },
    { label: "Profile", icon: <PiUserCircleCheckDuotone />, to: "/profile" },
    { label: "Contributions", icon: <MdAddHomeWork />, to: "/jobs" },
    { label: "Claims", icon: <AiOutlineNotification />, to: "/claims" },
    { label: "Reports", icon: <TbReport />, to: "/reports" },
    { label: "Policies", icon: <MdPolicy />, to: "/policies" },
    { label: "Applicants", icon: <FaUsersCog />, to: "/applicants" },
    { label: "Users", icon: <FaUsers />, to: "/users" },
    { label: "Payments", icon: <GiMoneyStack />, to: "/payments" },
    { label: "Benefits", icon: <MdOutlineSettingsSuggest />, to: "/benefits" },
    { label: "Settings", icon: <MdOutlineSettingsSuggest />, to: "/settings" },
    { label: "Chevron Right", icon: <FaChevronRight />, to: "/Login" }
  ];

  const sidebarContent = (
    <>
        {/* Brand Header */}
        <div className='px-6 pt-8 pb-7 border-b boder-white/6'>
          <div className='flex item-center justify-between'>
              <div className='flex item-center gap-4'>
                <img src={Logo} alt="Logo" style={logoImageStyles} />
              </div>

              {/* Close Menu on mobile */}
              <button onClick={()=>setMobileOpen(false)} className='lg:hidden text-slate-400 hover:text-white/6 p-1'>
                <PiXCircleDuotone size={20}/>
              </button>
          </div>
        </div>
        {/* User profile Card */}
       {userName && (
        <div className='mx-3 pt-8 pb-8 px-10 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/3'>
          <div className='flex items-center gap-5 '>
            <div className='w-9 h-9 rounded-lg items-center bg-slate-800 flex item-center justify-center ring-1 ring-white/7 shrink-0'>
              <span>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className='min-w-0'>
              <p className='text-[13px] font-medium text-slate-200 truncate'>{userName}</p>
              <p className='text-[11px] font-medium text-slate-500 truncate'>{role === "ADMIN" ? "Administrator" : "MEMBER"}</p>
            </div>
          </div>
        </div>
       )}

        {/* Section label */}
        <div className='px-5 pt-5 pb-2'>
          <p className='text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em] text-slate-500 align-middle'>Main</p>
        </div>
        {/* Navigation Label */}
         <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const isActive = pathname.startsWith(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500" />
                )}
                <span
                  className={`w-5 h-5 shrink-0 inline-flex items-center justify-center ${
                    isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1 min-w-0 text-left truncate">{item.label}</span>
                {isActive && <FaChevronRight className="w-3.5 h-3.5 text-indigo-500/50" />}
              </Link>
            );
          })}
        </div>
        {/* Logout */}
    </>
  )
  return (
    <>
      {/* Mobile Humber Button */}
      <button onClick={()=>setMobileOpen(true)} className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-indigo-900 shadow-lg border border-white/10'>
        <GiHamburgerMenu size={20}/>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && <div className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40' onClick={()=>setMobileOpen(false)} />}

      {/* Desktop sidebar */}
      <aside className='hidden lg:flex flex-col h-full w-[260px] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4'>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar