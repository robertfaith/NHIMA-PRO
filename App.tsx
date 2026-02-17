
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './src/Components/Auth/Login/Login';
import Register from './src/Components/Auth/Register/Register'; // Update the path to the actual location of your Register component
import Home from './src/Components/Home/Home'; // Update the path to the actual location of your Home component
// Import the necessary components for routing
import Dashboard from './src/Dashboard/Dashboard';// Update the path to the actual location of your Login component
import Career from './src/Components/Careers/Career'; // Update the path to the actual location of your Career component
import Loans from './src/Components/Loans/Loans';
import MemDashboard from './src/MemDashboard/MemDashboard';

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
    path: '/Career',
    element: <Career />,
  },
  {
    path: '/Loans',
    element: <Loans/>
  },
  {
    path: '/MemDashboard',
    element: <MemDashboard/>
  }
  
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}