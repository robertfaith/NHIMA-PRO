import './navbar.scss'
import { useState } from "react"
import logo from '../../assets/2.png'
import { GiHamburgerMenu } from "react-icons/gi"
import Sidebar from "../SideBar/Sidebar"

const Navbar = () => {
  const [showSideBar, setShowSideBar] = useState(false)

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        
        <button
          type="button"
          className="hamburgerBtn"
          onClick={() => setShowSideBar(prev => !prev)}
          aria-label="Toggle sidebar"
          aria-expanded={showSideBar}
        >
          <GiHamburgerMenu className="hamburger" />
        </button>
      </header>

      <Sidebar />
    </div>
  )
}

export default Navbar