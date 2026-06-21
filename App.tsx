import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'

import Home         from './src/Components/Home/Home'
import Loans        from './src/Components/Loans/Loans'
import AboutSection from './src/Components/About/AboutSection'
import Benefits     from './src/Components/Benefits/Benefits'
import Facility     from './src/Components/Facility/Facility'
import Contact      from './src/Components/Contact/Contact'
import Loginlanding    from './src/Components/Auth/Loginlanding'
import Registerlanding from './src/Components/Auth/Register/Registerlanding'
import EmployerDashboard  from './src/EmployerDashboard/EmployerDashboard'
import Dashboard          from './src/EmployerDashboard/Pages/Dashboard'
import EmployerContributions      from './src/EmployerDashboard/Pages/EmployerContributions'
import MemberContributions      from './src/EmployerDashboard/Pages/MemberContributions'
import Notifications      from './src/EmployerDashboard/Pages/Notifications'
import Settings           from './src/EmployerDashboard/Pages/Settings'
import Support            from './src/EmployerDashboard/Pages/Support'
import Facilities         from './src/EmployerDashboard/Pages/Facilities'
import EmployerBenefits   from './src/EmployerDashboard/Pages/Benefits'
import Payments           from './src/EmployerDashboard/Pages/Payments'
import Verifications from './src/EmployerDashboard/Pages/Verifications'
import NRC from './src/EmployerDashboard/Pages/NRC'
import New from './src/EmployerDashboard/Pages/New'
import Compliance from './src/MemDashboard/Pages/Compliance'
import Reports from './src/EmployerDashboard/Pages/Reports'
import MemberBenefits from './src/EmployerDashboard/Pages/Benefits'
import AdminProfile from './src/EmployerDashboard/Pages/AdminProfile'
import MemberProfile from './src/EmployerDashboard/Pages/MemberProfile'
import AgentProfile from './src/EmployerDashboard/Pages/AgentProfile'
import EmployerProfile from './src/EmployerDashboard/Pages/EmployerProfile'
import AdminClaims from './src/EmployerDashboard/Pages/AdminClaims'
import MemberClaims from './src/EmployerDashboard/Pages/MemberClaims'
import EmployerClaims from './src/EmployerDashboard/Pages/EmployerClaims'


const router = createBrowserRouter([

  // ── Public routes ───────────────────────────────────────────────
  { path: '/',         element: <Navigate to="/home" replace /> },
  { path: '/login',    element: <Loginlanding />    },
  { path: '/register', element: <Registerlanding /> },
  { path: '/home',     element: <Home />            },
  { path: '/benefits', element: <Benefits />        },
  { path: '/loans',    element: <Loans />           },
  { path: '/about',    element: <AboutSection />    },
  { path: '/facility', element: <Facility />        },
  { path: '/contact',  element: <Contact />         },
  { path: '/payments',  element: <Payments/>         },
  { path: '/notifications',  element: <Notifications />},




  // ── Dashboard routes (all nested under /dashboard) ──────────────
  {
    path:    '/dashboard',
    element: <EmployerDashboard />,
    children: [
      { index: true,                    element: <Dashboard />        },
      { path: 'EmployerContributions',  element: <EmployerContributions />    },
      { path: 'contributions',          element: <MemberContributions /> },
      { path: 'notifications',          element: <Notifications />    },
      { path: 'settings',               element: <Settings />         },
      { path: 'support',                element: <Support />          },
      { path: 'facilities',             element: <Facilities />       },
      { path: 'emp-benefits',           element: <EmployerBenefits /> },
      { path: 'nrc',                    element: <NRC />              },
      { path: 'verifications',          element: <Verifications />    },
      { path: 'payments',               element: <Payments />         },
      { path: 'new',                    element: <New />              },
      { path: 'compliance',             element: <Compliance />       },
      { path: 'reports',                element: <Reports />          },
      { path: 'benefits',               element: <MemberBenefits />   },
      { path: 'admin-profile',          element: <AdminProfile />     },
      { path: 'memberprofile',          element: <MemberProfile/>     },
      { path: 'agentprofile',           element: <AgentProfile/>      },
      { path: 'employerprofile',        element: <EmployerProfile />  },
      { path: 'adminclaims',            element: <AdminClaims />      },
      { path: 'employerclaims',         element: <EmployerClaims />   },
      { path: 'memberclaims',           element: <MemberClaims />     },
    ],
  },

  // ── Catch-all ───────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/home" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}