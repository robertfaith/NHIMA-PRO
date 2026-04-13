import { Toaster} from "react-hot-toast";
import { Navigate, Route } from "react-router-dom";
import Login from "../Components/Auth/Login/Login";
import Settings from "./Pages/Settings";
import Notifications from "./Pages/Notifications";
import Reports from "./Pages/Reports";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import EmployeeManagement from "./Pages/EmployeeManagement";
import Compliance from "./Pages/Compliance";
import Support from "./Pages/Support";
import Payments from "./Pages/Payments";
import Contributions from "./Pages/Contributions";
const EmployerDashboard = () => {
  return (
    <>
      <Toaster />
      <Route path="/Login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Compliance" element={<Compliance />} />
        <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
        <Route path="/Reports" element={<Reports />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Contributions" element={<Contributions />} />
        <Route path="/Payments" element={<Payments />} />
        <Route path="/Support" element={<Support />} />
      </Route>
      <Route path="*" element={<Navigate to="/Dashboard" replace />} />
    </>
  )
}

export default EmployerDashboard