import React from 'react';
import './MemSideBar.scss';

//icons 
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
  return (
    <aside className={`sideBar ${show ? 'action' : ''}`} aria-hidden={!show}>
      <ul>
        <li><a href="/MemDashboard"><SiHomebridge /> Home</a></li>
        <li><a href="/Profile"><PiUserCircleCheckDuotone /> My Profile</a></li>
        <li><a href="/Contribution"><GiMoneyStack /> Contribution</a></li>
        <li><a href="/Claims"><GrVolumeControl /> Claims</a></li>
        <li><a href="/facility"><MdAddHomeWork /> Facilities</a></li>
        <li><a href="/Benefits"><FaUsers /> Benefits</a></li>
        <li><a href="/Notifications"> <AiOutlineNotification /> Notifications</a></li>
        <li><a href="/Documents"><TbReport /> Documents</a></li>
        <li><a href="/Support"><MdPolicy /> Support</a></li>
        <li><a href="/MemSettings"><MdOutlineSettingsSuggest /> Settings</a></li>
      </ul>
    </aside>
  );
}

export default MemSideBar;