import { Outlet } from "react-router-dom"
import Sidebar from "./SideBar/Sidebar"

/*import HeaderSection from "./HeaderSection"*/

function EmployerDashboard() {
  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/50">
           <Sidebar />
         {/*<HeaderSection type = "greeting" title = "Welcome" user = {loggrdIn?.firstName || 'Guest} subtext = "Access and manage your account Efficiently"/> */}
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 pt-16 sm:pt-6 lg:p-8 max-w-400 mx-auto">
          <Outlet />
          </div>
        </main>
    </div>
  )
}

export default EmployerDashboard