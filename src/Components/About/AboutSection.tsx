import Footer from "../Home/Footer";
import Navbar from "../Home/Navbarr";
import Testimonials from "../Home/Testimonials";
import Tittle from "../Home/Tittle";
import HeroSec from './Hero/HeroSec'
import AboutSec from "./bout/AboutSec";


const AboutSection: React.FC = () => {
  return (
    <div>
        <Navbar  />
        <HeroSec />
        <Tittle subTittle='ABOUT US' tittle='Learn More About Us'/>
        <AboutSec />
        <Tittle subTittle='TESTIMONIALS' tittle='what People Say'/>
        <Testimonials />
        <Footer />
    </div>
  )
}

export default AboutSection