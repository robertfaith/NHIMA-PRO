import { Outlet } from "react-router-dom"
import Navbar from "./NavBar/navbar"
/*import HeaderSection from "./HeaderSection"*/

function MemDashboard() {
  return (
    <section className="home">
      <div className="home-content">
        <div className="home-header">
           <Navbar />
         {/*<HeaderSection type = "greeting" title = "Welcome" user = {loggrdIn?.firstName || 'Guest} subtext = "Access and manage your account Efficiently"/> */}
        </div>
        <div className="memdashboard-body">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default MemDashboard