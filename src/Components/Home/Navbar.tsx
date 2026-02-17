import React, { useState } from 'react';
import './Navbar.scss'
import ABLogo from '../../assets/2.png';
import { FaBars } from "react-icons/fa6"





const Navbar: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () =>{
    setIsOpen(!isOpen)
  }

return (
  <nav className="navbar dack-nav">
    <div className="navbar-header">
      <img src={ABLogo} alt="AB Bank" />
    </div>
    <ul className={isOpen ? "nav-link active" : "nav-links"}>
      <li className="nav-item"><a className="nav-link" href="/Home">Home</a></li>
      <li className="nav-item"><a className="nav-link" href="/About">About</a></li>
      <li className="nav-item"><a className="nav-link" href="/Career">Benefits</a></li>
      <li className="nav-item"><a className="nav-link" href="/Facility">Facilities</a></li>
      <li className="nav-item"><a className="nav-link" href="/Contact">Contact Us</a></li>
      <li className="nav-item">
        <a className="nav-link btn-primary" href="/Register">Register</a>
      </li>
      <div className="icon" onClick={toggleMenu}>
        <FaBars/>
      </div>
    </ul>
  </nav>
)
}

export default Navbar