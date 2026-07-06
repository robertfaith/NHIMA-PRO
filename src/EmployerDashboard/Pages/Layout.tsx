import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
        <p>SideBar</p>
        <main>
          <Outlet />
        </main>
      </div>
  )
}

export default Layout