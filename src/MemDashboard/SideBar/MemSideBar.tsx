import React, { useEffect } from 'react';
import './MemSideBar.scss';
import { Link, useLocation } from "react-router-dom";

// icons
import { SiHomebridge } from "react-icons/si";
import { PiUserCircleCheckDuotone } from "react-icons/pi";
import { GrVolumeControl } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import { AiOutlineNotification } from "react-icons/ai";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { MdAddHomeWork } from "react-icons/md";

interface MemSideBarProps {
  show: boolean;
}

const MemSideBar: React.FC<MemSideBarProps> = ({ show }) => {
  const {pathname} = useLocation()
  const [, setMobileOpen] = React.useState(false)

  useEffect(()=>{
    // Sidebar initialization if needed
  }, [])

  //close mobile sidebar on route change
  useEffect(()=>{
    setMobileOpen(false)
  },[pathname])

  return (
    <aside className={`sideBar ${show ? 'action' : ''}`} aria-hidden={!show}>
      <button onClick={()=>setMobileOpen(true)} className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-inset'>
      </button>
      <ul>

        <li>
          <Link to="/memdashboard">
            <SiHomebridge /> Home
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/profile">
            <PiUserCircleCheckDuotone /> My Profile
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/contributions">
            <GiMoneyStack /> Contributions
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/claims">
            <GrVolumeControl /> Claims
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/facilities">
            <MdAddHomeWork /> Facilities
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/benefits">
            <FaUsers /> Benefits
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/notifications">
            <AiOutlineNotification /> Notifications
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/documents">
            <TbReport /> Documents
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/support">
            <MdPolicy /> Support
          </Link>
        </li>

        <li>
          <Link to="/memdashboard/settings">
            <MdOutlineSettingsSuggest /> Settings
          </Link>
        </li>

      </ul>
    </aside>
  );
};

export default MemSideBar;