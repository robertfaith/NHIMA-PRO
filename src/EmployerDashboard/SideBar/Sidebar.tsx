import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

import { GiHamburgerMenu, GiMoneyStack } from 'react-icons/gi'
import { SiHomebridge } from 'react-icons/si'
import { PiUserCircleCheckDuotone, PiXCircleDuotone } from 'react-icons/pi'
import { AiOutlineNotification } from 'react-icons/ai'
import { MdOutlineSettingsSuggest, MdPolicy, MdAddHomeWork, MdVerified, MdPendingActions, MdHealthAndSafety } from 'react-icons/md'
import { FaUsersCog, FaUsers, FaHospital, FaIdCard, FaUserCheck, FaMapMarkerAlt } from 'react-icons/fa'
import { FaChevronRight, FaBuildingColumns } from 'react-icons/fa6'
import { TbReport } from 'react-icons/tb'
import { BsPeopleFill, BsShieldCheck, BsClipboardCheckFill, BsGraphUpArrow, BsBuildingsFill, BsPersonPlusFill, BsFileEarmarkCheckFill } from 'react-icons/bs'
import { GrLogout } from 'react-icons/gr'

import Logo from '../../assets/2.png'
import './Sidebar.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'EMPLOYER' | 'AGENT' | 'MEMBER'

interface NavItem {
  label: string
  icon:  React.ReactNode
  to:    string
}

interface SidebarProps {
  role?:     UserRole
  userName?: string
}

// ─── Role-based nav maps ──────────────────────────────────────────────────────

const NAV_LINKS: Record<UserRole, NavItem[]> = {

  // ── Admin ──────────────────────────────────────────────────────────────────
  ADMIN: [
    { label: 'Dashboard',        icon: <SiHomebridge />,          to: '/admin'                    },
    { label: 'Profile',          icon: <PiUserCircleCheckDuotone />, to: '/admin/adminprofile'            },
    { label: 'Members',          icon: <BsPeopleFill />,          to: '/admin/members'            },
    { label: 'Employers',        icon: <BsBuildingsFill />,       to: '/admin/employers'          },
    { label: 'Agents',           icon: <FaUsersCog />,            to: '/admin/agents'             },
    { label: 'Claims',           icon: <BsClipboardCheckFill />,  to: '/admin/adminclaims'             },
    { label: 'Contributions',    icon: <GiMoneyStack />,          to: '/admin/contributions'      },
    { label: 'Benefits',         icon: <MdHealthAndSafety />,     to: '/admin/benefits'           },
    { label: 'Facilities',       icon: <FaHospital />,            to: '/admin/facilities'         },
    { label: 'Compliance',       icon: <BsShieldCheck />,         to: '/admin/compliance'         },
    { label: 'Reports',          icon: <TbReport />,              to: '/admin/reports'            },
    { label: 'Audit Logs',       icon: <BsGraphUpArrow />,        to: '/admin/audit'              },
    { label: 'Users',            icon: <FaUsers />,               to: '/admin/users'              },
    { label: 'Policies',         icon: <MdPolicy />,              to: '/admin/policies'           },
    { label: 'Settings',         icon: <MdOutlineSettingsSuggest />, to: '/admin/settings'        },
  ],

  // ── Employer ───────────────────────────────────────────────────────────────
  EMPLOYER: [
    { label: 'Dashboard',        icon: <SiHomebridge />,             to: '/dashboard'               },
    { label: 'Profile',          icon: <PiUserCircleCheckDuotone />, to: '/dashboard/employerprofile'       },
    { label: 'Employees',        icon: <BsPeopleFill />,             to: '/dashboard/employees'     },
    { label: 'Contributions',    icon: <MdAddHomeWork />,            to: '/dashboard/EmployerContributions' },
    { label: 'Claims',           icon: <AiOutlineNotification />,    to: '/dashboard/employerclaims'        },
    { label: 'Benefits',         icon: <MdOutlineSettingsSuggest />, to: '/dashboard/emp-benefits'  },
    { label: 'Payments',         icon: <GiMoneyStack />,             to: '/dashboard/payments'      },
    { label: 'Compliance',       icon: <BsShieldCheck />,            to: '/dashboard/compliance'    },
    { label: 'Reports',          icon: <TbReport />,                 to: '/dashboard/reports'       },
    { label: 'Policies',         icon: <MdPolicy />,                 to: '/dashboard/policies'      },
    { label: 'Settings',         icon: <MdOutlineSettingsSuggest />, to: '/dashboard/settings'      },
    
  ],

  // ── Agent ──────────────────────────────────────────────────────────────────
  AGENT: [
    { label: 'Dashboard',        icon: <SiHomebridge />,             to: '/dashboard'                  },
    { label: 'Profile',          icon: <PiUserCircleCheckDuotone />, to: '/dashboard/agentprofile'          },
    { label: 'Register Member',  icon: <BsPersonPlusFill />,         to: '/dashboard/members/new'      },
    { label: 'Members',          icon: <BsPeopleFill />,             to: '/dashboard/members'          },
    { label: 'Verifications',    icon: <MdVerified />,               to: '/dashboard/verifications'    },
    { label: 'Applications',     icon: <MdPendingActions />,         to: '/dashboard/applications'     },
    { label: 'NRC Checks',       icon: <FaIdCard />,                 to: '/dashboard/nrc'              },
    { label: 'Tasks',            icon: <BsFileEarmarkCheckFill />,   to: '/dashboard/tasks'            },
    { label: 'Reports',          icon: <TbReport />,                 to: '/dashboard/reports'          },
    { label: 'Settings',         icon: <MdOutlineSettingsSuggest />, to: '/dashboard/settings'         },
  ],

  // ── Member ─────────────────────────────────────────────────────────────────
  MEMBER: [
    { label: 'Dashboard',        icon: <SiHomebridge />,             to: '/dashboard'                  },
    { label: 'Profile',          icon: <PiUserCircleCheckDuotone />, to: '/dashboard/memberprofile'          },
    { label: 'Contributions',    icon: <MdAddHomeWork />,            to: '/dashboard/contributions'    },
    { label: 'Claims',           icon: <AiOutlineNotification />,    to: '/dashboard/memberclaims'           },
    { label: 'Benefits',         icon: <MdHealthAndSafety />,        to: '/dashboard/Benefits'         },
    { label: 'Providers',        icon: <FaHospital />,               to: '/dashboard/Providers'        },
    { label: 'Policies',         icon: <MdPolicy />,                 to: '/dashboard/Policies'         },
    { label: 'Reports',          icon: <TbReport />,                 to: '/dashboard/Reports'          },
    { label: 'Settings',         icon: <MdOutlineSettingsSuggest />, to: '/dashboard/settings'         },
  ],
}

// ─── Role display helpers ─────────────────────────────────────────────────────

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN:    'Administrator',
  EMPLOYER: 'Employer',
  AGENT:    'NHIMA Agent',
  MEMBER:   'Member',
}

const ROLE_MOD: Record<UserRole, string> = {
  ADMIN:    'admin',
  EMPLOYER: 'employer',
  AGENT:    'agent',
  MEMBER:   'member',
}

// ─── Logout ───────────────────────────────────────────────────────────────────

const handleLogOut = () => {
  window.location.href = '/login'
}

// ─── Component ────────────────────────────────────────────────────────────────

const Sidebar = ({ role = 'MEMBER', userName = 'User' }: SidebarProps) => {
  const { pathname }                = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const navLinks = NAV_LINKS[role]

  // Exact match for root dashboard, startsWith for everything else
  const isActive = (to: string) =>
    to === '/dashboard' || to === '/admin'
      ? pathname === to
      : pathname.startsWith(to)

  const sidebarContent = (
    <>
      {/* ── Brand Header ── */}
      <div className="sb-header">
        <div className="sb-header__inner">
          <img src={Logo} alt="NHIMA Logo" className="sb-logo" />
          <button className="sb-close" onClick={() => setMobileOpen(false)}>
            <PiXCircleDuotone size={20} />
          </button>
        </div>
      </div>

      {/* ── User Profile Card ── */}
      <div className="sb-profile">
        <div className="sb-profile__avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="sb-profile__info">
          <p className="sb-profile__name">{userName}</p>
          <p className="sb-profile__role">{ROLE_LABEL[role]}</p>
          <span className={`sb-profile__badge sb-profile__badge--${ROLE_MOD[role]}`}>
            {ROLE_MOD[role]}
          </span>
        </div>
      </div>

      {/* ── Section Label ── */}
      <div className="sb-section-label">Navigation</div>

      {/* ── Navigation ── */}
      <nav className="sb-nav">
        {navLinks.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`sb-nav__item ${isActive(item.to) ? 'sb-nav__item--active' : ''}`}
          >
            {isActive(item.to) && <span className="sb-nav__indicator" />}
            <span className="sb-nav__icon">{item.icon}</span>
            <span className="sb-nav__label">{item.label}</span>
            {isActive(item.to) && <FaChevronRight className="sb-nav__chevron" />}
          </Link>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="sb-footer">
        <button onClick={handleLogOut} className="sb-logout">
          <GrLogout style={{ width: 17, height: 17 }} />
          <span>Log Out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button className="sb-hamburger" onClick={() => setMobileOpen(true)}>
        <GiHamburgerMenu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sb-overlay" onClick={() => setMobileOpen(false)} />
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
