import React, { useEffect, useState } from 'react';
import './Navbarr.scss';
import ABLogo from '../../assets/2.png';
import { FaBars } from "react-icons/fa6";

const Navbar: React.FC = () => {

  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Sticky scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <nav className={`navbar ${sticky ? 'dark-nav' : ''}`}>
      
      <div className="navbar-header">
        <img src={ABLogo} alt="AB Bank" />
      </div>

      <ul className={isOpen ? "nav-links active" : "nav-links"}>
        <li><a href="/Home">Home</a></li>
        <li><a href="/About">About</a></li>
        <li><a href="/Benefits">Benefits</a></li>
        <li><a href="/Facility">Facilities</a></li>
        <li><a href="/Contact">Contact Us</a></li>
        <li>
          <a className="btn-primary" href="/Register">Register</a>
        </li>
      </ul>

      <button 
        className="menu-icon" 
        onClick={toggleMenu} 
        aria-label="Toggle menu"
      >
        <FaBars />
      </button>

    </nav>
  );
};

export default Navbar;