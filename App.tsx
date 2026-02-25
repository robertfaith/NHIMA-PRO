
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './src/Components/Auth/Login/Login';
import Register from './src/Components/Auth/Register/Register'; 
import Home from './src/Components/Home/Home'; 
// Import the necessary components for routing
import Dashboard from './src/Dashboard/Dashboard';
import Loans from './src/Components/Loans/Loans';
import MemDashboard from './src/MemDashboard/MemDashboard';
import AboutSection from './src/Components/About/AboutSection';
import Benefits from './src/Components/Careers/Benefits';
import Facility from './src/Components/Facility/Facility';
import Contact from './src/Components/Contact/Contact';

const router = createBrowserRouter([
  {
    path: '/Login',
    element: <Login />, // Use the Login component here
  },
  {
    path: '/Register',
    element: <Register />,
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
    element: <Loans/>
  },
  {
    path: '/MemDashboard',
    element: <MemDashboard/>
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
  }
  
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}