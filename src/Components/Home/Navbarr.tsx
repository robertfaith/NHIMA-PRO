import React, { useEffect, useState } from 'react';
import './Navbarr.scss';
import ABLogo from '../../assets/2.png';
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 180);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${sticky ? 'dark-nav' : ''}`}>

      <div className="navbar-header">
        <img src={ABLogo} alt="NHIMA Logo" />
      </div>

      <ul className={isOpen ? 'nav-links active' : 'nav-links'}>
        <li><a href="/Home" onClick={closeMenu}>Home</a></li>
        <li><a href="/About" onClick={closeMenu}>About</a></li>
        <li><a href="/Benefits" onClick={closeMenu}>Benefits</a></li>
        <li><a href="/Facility" onClick={closeMenu}>Facilities</a></li>
        <li><a href="/Contact" onClick={closeMenu}>Contact Us</a></li>
        <li>
          <a
            href="/Register"
            className="btn-primary"
            onClick={closeMenu}
          >
            Register
          </a>
        </li>
      </ul>

      <button
        className="menu-icon"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

    </nav>
  );
};

export default Navbar;