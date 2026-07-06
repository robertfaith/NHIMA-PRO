import { Outlet } from 'react-router-dom'
import Sidebar from './SideBar/Sidebar'
import './EmployerDashboard.scss'

function EmployerDashboard() {
  return (
    <div className="employer-layout">
      <Sidebar />
      <main className="employer-main">
        <Outlet />
      </main>
    </div>
  )
}

export default EmployerDashboard