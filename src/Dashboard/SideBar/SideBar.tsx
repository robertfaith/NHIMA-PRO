import './SideBar.scss';

//images
import logo from '../../assets/AB_Bank_Logo.png';

//icons
import { AiTwotoneDashboard } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { GrVolumeControl } from "react-icons/gr";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { LiaBlogSolid } from "react-icons/lia";
import { AiOutlineNotification } from "react-icons/ai";
import { TbReport } from "react-icons/tb";
import { PiUserCircleCheckDuotone } from "react-icons/pi";
import { MdOutlineSecurity } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";




function SideBar() {
  return (
    <div className='sideBar grid'>

      <div className="logoDiv flex">
        <img src={logo} alt="Logo" />
      </div>
      <div className="menuDev">

        <h3>QUICK MENU</h3>
        <ul className="menulists grid">


          <li className='listItem'>
            <a href="#" className='menuLink flex'>
             <AiTwotoneDashboard />
              <span className="smallText">Dashboard</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <FaUsers />
              <span className="smallText">Users Management</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <GrVolumeControl />
              <span className="smallText">Roles & Access Control</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <MdOutlineSettingsSuggest />
              <span className="smallText">System Settings</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <LiaBlogSolid />
              <span className="smallText">Audit Logs</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <AiOutlineNotification />
              <span className="smallText">Notifications</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <TbReport />
              <span className="smallText">Reports & Analytics</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <PiUserCircleCheckDuotone />
              <span className="smallText">Profile & Account</span>
          </a>
          </li>

        </ul>
        
      </div>
      <div className="menuDev">

        <h3>SETTINGS</h3>
        <ul className="menulists grid">


          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <MdOutlineSecurity />
              <span className="smallText">Security Management</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <FaUsers />
              <span className="smallText">Modules / Features Management</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <GrVolumeControl />
              <span className="smallText">Data Management</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <MdOutlineSettingsSuggest />
              <span className="smallText">System Settings</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <LiaBlogSolid />
              <span className="smallText">Support / Help Desk</span>
          </a>
          </li>
          <li className='listItem'>
          <a href="#" className='menuLink flex'>
            <MdPolicy />
              <span className="smallText">Compliance & Policies</span>
          </a>
          </li>
        </ul>
       
      </div>
  <div className='sideBarCard'>
     <BsQuestionCircle className='icon'/>
     <div className="cardContent">
      <div className="cicle1"></div>
      <div className="cicle1"></div>
      <h3>Need Help?</h3>
      <p>Contact our support team for assistance.</p>
      <button className='btn'>Contact Support</button>
     </div>
    </div> 
    </div>
  );
}


export default SideBar;