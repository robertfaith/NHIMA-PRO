import Navbar from "../Home/Navbarr";
import HeroSec from './Hero/HeroSec'
import AboutSec from "./bout/AboutSec";


const AboutSection: React.FC = () => {
  return (
    <div>
        <Navbar  />
        <HeroSec />
        <AboutSec />
    </div>
  )
}

export default AboutSection