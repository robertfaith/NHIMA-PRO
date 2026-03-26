import Navbar from "./NavBar/navbar"
/*import HeaderSection from "./HeaderSection"*/

function MemDashboard() {
  {/*const loggedIn = { firstName: };*/}
  return (
    <section className="home">
      <div className="home-content">
        <div className="home-header">
           <Navbar />
         {/*<HeaderSection type = "greeting" title = "Welcome" user = {loggrdIn?.firstName || 'Guest} subtext = "Access and manage your account Efficiently"/> */}
        </div>
      </div>
    </section>
  )
}

export default MemDashboard