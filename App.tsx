
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';


import Home from './src/Components/Home/Home';
// Import the necessary components for routing
import Dashboard from './src/EmployerDashboard/Pages/Dashboard';
import Loans from './src/Components/Loans/Loans';
import MemDashboard from './src/MemDashboard/MemDashboard';
import MemDashboardHome from './src/MemDashboard/Pages/Dashboard';
import MemProfile from './src/MemDashboard/Pages/Profile';
import MemContributions from './src/MemDashboard/Pages/Contributions';
import MemNotifications from './src/MemDashboard/Pages/Notifications';
import MemSettings from './src/MemDashboard/Pages/Settings';
import MemSupport from './src/MemDashboard/Pages/Support';
import MemClaims from './src/MemDashboard/Pages/Claims';
import MemFacilities from './src/MemDashboard/Pages/Facilities';
import MemBenefits from './src/MemDashboard/Pages/Benefits';
import MemDocuments from './src/MemDashboard/Pages/Documents';
import AboutSection from './src/Components/About/AboutSection';
import Benefits from './src/Components/Benefits/Benefits';
import Facility from './src/Components/Facility/Facility';
import Contact from './src/Components/Contact/Contact';
import EmployerDashboard from './src/EmployerDashboard/EmployerDashboard';
import Loginlanding from './src/Components/Auth/Loginlanding';
import Registerlanding from './src/Components/Auth/Register/Registerlanding';


const router = createBrowserRouter([
 
    {
    path: '/Login',
    element: <Loginlanding />,
  },
   {
    path: '/Register',
    element: <Registerlanding />,
  },
  {
    path: '/EmployerDashboard',
    element: <EmployerDashboard />,
    children: [
      { index: true, element: <Dashboard /> },
    ]
  },
  {
    path: '/Dashboard',
    element: <Dashboard />,
  },
  {
    path: '/Home',
    element: <Home />,
  },
  {
    path: '/Benefits',
    element: <Benefits />,
  },
  {
    path: '/Loans',
    element: <Loans />
  },
  {
    path: '/memdashboard',
    element: <MemDashboard />,
    children: [
      {
        index: true,
        element: <MemDashboardHome />,
      },
      {
        path: 'dashboard',
        element: <MemDashboardHome />,
      },
      {
        path: 'profile',
        element: <MemProfile />,
      },
      {
        path: 'contributions',
        element: <MemContributions />,
      },
      {
        path: 'notifications',
        element: <MemNotifications />,
      },
      {
        path: 'settings',
        element: <MemSettings />,
      },
      {
        path: 'support',
        element: <MemSupport />,
      },
      {
        path: 'claims',
        element: <MemClaims />,
      },
      {
        path: 'facilities',
        element: <MemFacilities />,
      },
      {
        path: 'benefits',
        element: <MemBenefits />,
      },
      {
        path: 'documents',
        element: <MemDocuments />,
      },
      {
        path: '*',
        element: <Navigate to="/memdashboard" replace />,
      },
    ],
  },
  {
    path: '/About',
    element: <AboutSection />
  },
  {
    path: '/Facility',
    element: <Facility />
  },
  {
    path: '/Contact',
    element: <Contact />
  },
  {
    path: '*',
    element: <Navigate to="/Home" replace />
  }
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
