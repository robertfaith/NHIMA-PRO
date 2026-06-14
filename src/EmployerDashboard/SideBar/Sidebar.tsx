import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { SiHomebridge } from 'react-icons/si'
import { PiUserCircleCheckDuotone, PiXCircleDuotone } from 'react-icons/pi'
import { AiOutlineNotification } from 'react-icons/ai'
import { MdOutlineSettingsSuggest, MdPolicy, MdAddHomeWork } from 'react-icons/md'
import { GiMoneyStack } from 'react-icons/gi'
import { FaUsersCog, FaUsers } from 'react-icons/fa'
import { FaChevronRight } from 'react-icons/fa6'
import { TbReport } from 'react-icons/tb'
import Logo from '../../assets/2.png'
import './Sidebar.scss'

// Define the navigation links for the sidebar
import '../Pages/Profile'


const navLinks = [
  { label: 'Dashboard',    icon: <SiHomebridge />,              to: '/dashboard'   },
  { label: 'Profile',      icon: <PiUserCircleCheckDuotone />,  to: '/profile'     },
  { label: 'Contributions',icon: <MdAddHomeWork />,             to: '/jobs'        },
  { label: 'Claims',       icon: <AiOutlineNotification />,     to: '/claims'      },
  { label: 'Reports',      icon: <TbReport />,                  to: '/reports'     },
  { label: 'Policies',     icon: <MdPolicy />,                  to: '/policies'    },
  { label: 'Applicants',   icon: <FaUsersCog />,                to: '/applicants'  },
  { label: 'Users',        icon: <FaUsers />,                   to: '/users'       },
  { label: 'Payments',     icon: <GiMoneyStack />,              to: '/payments'    },
  { label: 'Benefits',     icon: <MdOutlineSettingsSuggest />,  to: '/benefits'    },
  { label: 'Settings',     icon: <MdOutlineSettingsSuggest />,  to: '/settings'    },
]

const Sidebar = () => {
  const { pathname }                    = useLocation()
  const [userName,   setUserName]       = useState<string>('Robert Mumba')
  const [mobileOpen, setMobileOpen]     = useState(false)
  const role                            = 'MEMBER'

  useEffect(() => { setUserName(userName) }, [])
  useEffect(() => { setMobileOpen(false)  }, [pathname])

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="sb-header">
        <div className="sb-header__inner">
          <img src={Logo} alt="NHIMA Logo" className="sb-logo" />
          <button
            className="sb-close"
            onClick={() => setMobileOpen(false)}
          >
            <PiXCircleDuotone size={20} />
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      {userName && (
        <div className="sb-profile">
          <div className="sb-profile__avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="sb-profile__info">
            <p className="sb-profile__name">{userName}</p>
            <p className="sb-profile__role">
              {role === 'MEMBER' ? 'Member' : 'Administrator'}
            </p>
          </div>
        </div>
      )}

      {/* Section Label */}
      <div className="sb-section-label">Main</div>

      {/* Navigation */}
      <nav className="sb-nav">
        {navLinks.map((item) => {
          const isActive = pathname.startsWith(item.to)
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`sb-nav__item ${isActive ? 'sb-nav__item--active' : ''}`}
            >
              {isActive && <span className="sb-nav__indicator" />}
              <span className="sb-nav__icon">{item.icon}</span>
              <span className="sb-nav__label">{item.label}</span>
              {isActive && <FaChevronRight className="sb-nav__chevron" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout placeholder */}
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sb-hamburger"
        onClick={() => setMobileOpen(true)}
      >
        <GiHamburgerMenu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sb-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="sb-desktop">{sidebarContent}</aside>

      {/* Mobile sidebar */}
      <aside className={`sb-mobile ${mobileOpen ? 'sb-mobile--open' : ''}`}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar