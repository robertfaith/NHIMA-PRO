import { useEffect, useState } from 'react'
<<<<<<< HEAD
import { useLocation, Link, useNavigate } from 'react-router-dom'

import { GiHamburgerMenu, GiMoneyStack }                          from 'react-icons/gi'
import { SiHomebridge }                                           from 'react-icons/si'
import { PiUserCircleCheckDuotone, PiXCircleDuotone }            from 'react-icons/pi'
import { AiOutlineNotification }                                  from 'react-icons/ai'
import { MdOutlineSettingsSuggest, MdPolicy, MdAddHomeWork,
         MdVerified, MdPendingActions, MdHealthAndSafety }        from 'react-icons/md'
import { FaUsersCog, FaUsers, FaHospital, FaIdCard }             from 'react-icons/fa'
import { FaChevronRight }                                         from 'react-icons/fa6'
import { TbReport }                                               from 'react-icons/tb'
import { BsPeopleFill, BsShieldCheck, BsClipboardCheckFill,
         BsGraphUpArrow, BsBuildingsFill, BsPersonPlusFill,
         BsFileEarmarkCheckFill }                                 from 'react-icons/bs'
import { GrLogout }                                              from 'react-icons/gr'

import Logo from '../../assets/2.png'
import { api, clearTokens, getStoredRole } from '../../utils/auth'  // ← adjust path
import './Sidebar.scss'

// ─── Types ────────────────────────────────────────────────────────────────────
=======
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

>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
export type UserRole = 'ADMIN' | 'EMPLOYER' | 'AGENT' | 'MEMBER'

interface NavItem {
  label: string
  icon:  React.ReactNode
  to:    string
}

<<<<<<< HEAD
// ─── Nav maps ─────────────────────────────────────────────────────────────────
const NAV_LINKS: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard',     icon: <SiHomebridge />,             to: '/admin'               },
    { label: 'Profile',       icon: <PiUserCircleCheckDuotone />, to: '/admin/adminprofile'  },
    { label: 'Members',       icon: <BsPeopleFill />,             to: '/admin/members'       },
    { label: 'Employers',     icon: <BsBuildingsFill />,          to: '/admin/employers'     },
    { label: 'Agents',        icon: <FaUsersCog />,               to: '/admin/agents'        },
    { label: 'Claims',        icon: <BsClipboardCheckFill />,     to: '/admin/adminclaims'   },
    { label: 'Contributions', icon: <GiMoneyStack />,             to: '/admin/contributions' },
    { label: 'Benefits',      icon: <MdHealthAndSafety />,        to: '/admin/benefits'      },
    { label: 'Facilities',    icon: <FaHospital />,               to: '/admin/facilities'    },
    { label: 'Compliance',    icon: <BsShieldCheck />,            to: '/admin/compliance'    },
    { label: 'Reports',       icon: <TbReport />,                 to: '/admin/reports'       },
    { label: 'Audit Logs',    icon: <BsGraphUpArrow />,           to: '/admin/audit'         },
    { label: 'Users',         icon: <FaUsers />,                  to: '/admin/users'         },
    { label: 'Policies',      icon: <MdPolicy />,                 to: '/admin/policies'      },
    { label: 'Settings',      icon: <MdOutlineSettingsSuggest />, to: '/admin/settings'      },
  ],
  EMPLOYER: [
    { label: 'Dashboard',     icon: <SiHomebridge />,             to: '/dashboard'                       },
    { label: 'Profile',       icon: <PiUserCircleCheckDuotone />, to: '/dashboard/employerprofile'       },
    { label: 'Employees',     icon: <BsPeopleFill />,             to: '/dashboard/employees'             },
    { label: 'Contributions', icon: <MdAddHomeWork />,            to: '/dashboard/EmployerContributions' },
    { label: 'Claims',        icon: <AiOutlineNotification />,    to: '/dashboard/employerclaims'        },
    { label: 'Benefits',      icon: <MdOutlineSettingsSuggest />, to: '/dashboard/emp-benefits'          },
    { label: 'Payments',      icon: <GiMoneyStack />,             to: '/dashboard/payments'              },
    { label: 'Compliance',    icon: <BsShieldCheck />,            to: '/dashboard/compliance'            },
    { label: 'Reports',       icon: <TbReport />,                 to: '/dashboard/reports'               },
    { label: 'Policies',      icon: <MdPolicy />,                 to: '/dashboard/policies'              },
    { label: 'Settings',      icon: <MdOutlineSettingsSuggest />, to: '/dashboard/settings'              },
  ],
  AGENT: [
    { label: 'Dashboard',       icon: <SiHomebridge />,             to: '/dashboard'               },
    { label: 'Profile',         icon: <PiUserCircleCheckDuotone />, to: '/dashboard/agentprofile'  },
    { label: 'Register Member', icon: <BsPersonPlusFill />,         to: '/dashboard/members/new'   },
    { label: 'Members',         icon: <BsPeopleFill />,             to: '/dashboard/members'       },
    { label: 'Verifications',   icon: <MdVerified />,               to: '/dashboard/verifications' },
    { label: 'Applications',    icon: <MdPendingActions />,         to: '/dashboard/applications'  },
    { label: 'NRC Checks',      icon: <FaIdCard />,                 to: '/dashboard/nrc'           },
    { label: 'Tasks',           icon: <BsFileEarmarkCheckFill />,   to: '/dashboard/tasks'         },
    { label: 'Reports',         icon: <TbReport />,                 to: '/dashboard/reports'       },
    { label: 'Settings',        icon: <MdOutlineSettingsSuggest />, to: '/dashboard/settings'      },
  ],
  MEMBER: [
    { label: 'Dashboard',     icon: <SiHomebridge />,             to: '/dashboard'               },
    { label: 'Profile',       icon: <PiUserCircleCheckDuotone />, to: '/dashboard/memberprofile' },
    { label: 'Contributions', icon: <MdAddHomeWork />,            to: '/dashboard/contributions' },
    { label: 'Claims',        icon: <AiOutlineNotification />,    to: '/dashboard/memberclaims'  },
    { label: 'Benefits',      icon: <MdHealthAndSafety />,        to: '/dashboard/Benefits'      },
    { label: 'Providers',     icon: <FaHospital />,               to: '/dashboard/Providers'     },
    { label: 'Policies',      icon: <MdPolicy />,                 to: '/dashboard/Policies'      },
    { label: 'Reports',       icon: <TbReport />,                 to: '/dashboard/Reports'       },
    { label: 'Settings',      icon: <MdOutlineSettingsSuggest />, to: '/dashboard/settings'      },
  ],
}

=======
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

>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
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

<<<<<<< HEAD
// ─── User shape returned by GET /api/auth/me ──────────────────────────────────
// Response: { success, data: { user: { firstname, lastname, email, role, ... } } }
interface MeUser {
  firstname?: string
  lastname?:  string
  email:      string
  role:       UserRole
  nhima_id:   string
  // Employer-specific
  company_name?:       string
  contact_firstname?:  string
  contact_lastname?:   string
}

const getDisplayName = (u: MeUser): string => {
  // Employers have company name + contact name
  if (u.company_name)     return u.company_name
  if (u.firstname && u.lastname) return `${u.firstname} ${u.lastname}`
  if (u.firstname)               return u.firstname
  return u.email?.split('@')[0] ?? 'User'
}

// ─── Component ────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const { pathname }                = useLocation()
  const navigate                    = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user,       setUser]       = useState<MeUser | null>(null)
  const [authError,  setAuthError]  = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  // ── Load user from GET /api/auth/me (Bearer token auto-attached by api instance)
  useEffect(() => {
    const fetchMe = async () => {
      // Fast-path: if no token at all, don't even try
      if (!getStoredRole()) {
        navigate('/login', { replace: true })
        return
      }

      try {
        const { data: res } = await api.get('/api/auth/me')
        // Response shape: { success, data: { user: { ... } } }
        const userData: MeUser = res.data?.user ?? res.data ?? res
        setUser(userData)
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          // The axios interceptor in auth.ts already tried to refresh.
          // If we still get 401 here, session is truly gone.
          clearTokens()
          navigate('/login', { replace: true })
        } else {
          setAuthError(true)
        }
      }
    }

    fetchMe()
  }, [navigate])

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogOut = async () => {
    try {
      // Revoke the refresh token on the server
      const refreshToken = localStorage.getItem('nhima_refresh')
      await api.post('/api/auth/logout', { refreshToken })
    } catch {
      // Ignore — we're logging out regardless
    } finally {
      clearTokens()
      navigate('/login', { replace: true })
    }
  }

  // ── States ────────────────────────────────────────────────────────────────
  if (!user && !authError) {
    return (
      <aside className="sb-desktop sb-loading">
        <div className="sb-loading__spinner" />
      </aside>
    )
  }

  if (authError || !user) {
    return (
      <aside className="sb-desktop sb-error">
        <p>Could not load navigation.</p>
        <button onClick={() => navigate('/login', { replace: true })}>
          Back to Login
        </button>
      </aside>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const role        = user.role
  const displayName = getDisplayName(user)
  const navLinks    = NAV_LINKS[role]

=======
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
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
  const isActive = (to: string) =>
    to === '/dashboard' || to === '/admin'
      ? pathname === to
      : pathname.startsWith(to)

  const sidebarContent = (
    <>
<<<<<<< HEAD
      {/* Brand */}
=======
      {/* ── Brand Header ── */}
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
      <div className="sb-header">
        <div className="sb-header__inner">
          <img src={Logo} alt="NHIMA Logo" className="sb-logo" />
          <button className="sb-close" onClick={() => setMobileOpen(false)}>
            <PiXCircleDuotone size={20} />
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Profile card */}
      <div className="sb-profile">
        <div className="sb-profile__avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="sb-profile__info">
          <p className="sb-profile__name">{displayName}</p>
=======
      {/* ── User Profile Card ── */}
      <div className="sb-profile">
        <div className="sb-profile__avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="sb-profile__info">
          <p className="sb-profile__name">{userName}</p>
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
          <p className="sb-profile__role">{ROLE_LABEL[role]}</p>
          <span className={`sb-profile__badge sb-profile__badge--${ROLE_MOD[role]}`}>
            {ROLE_MOD[role]}
          </span>
        </div>
      </div>

<<<<<<< HEAD
      <div className="sb-section-label">Navigation</div>

      {/* Nav */}
=======
      {/* ── Section Label ── */}
      <div className="sb-section-label">Navigation</div>

      {/* ── Navigation ── */}
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
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

<<<<<<< HEAD
      {/* Logout */}
=======
      {/* ── Logout ── */}
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
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
<<<<<<< HEAD
=======
      {/* Mobile hamburger */}
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
      <button className="sb-hamburger" onClick={() => setMobileOpen(true)}>
        <GiHamburgerMenu size={20} />
      </button>

<<<<<<< HEAD
=======
      {/* Mobile overlay */}
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
      {mobileOpen && (
        <div className="sb-overlay" onClick={() => setMobileOpen(false)} />
      )}

<<<<<<< HEAD
      <aside className="sb-desktop">{sidebarContent}</aside>

=======
      {/* Desktop sidebar */}
      <aside className="sb-desktop">{sidebarContent}</aside>

      {/* Mobile sidebar */}
>>>>>>> b134d51a19f4c1fe01e30867606b2ec8dd64067c
      <aside className={`sb-mobile ${mobileOpen ? 'sb-mobile--open' : ''}`}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
