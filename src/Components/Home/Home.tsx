
import Navbar from "./Navbar"
import Hero from './Hero'
import Footer from "./Footer"
import Programs from "./Programs";
import Tittle from './Tittle';
import About from "./About";
import Gallary from "./Gallary";
import Testimonials from "./Testimonials"
import Contact from "./Contact";



const Home: React.FC = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <Tittle subTittle='OUR PROGRAMS' tittle='What are you interested in today?'/>
      <Programs/>
      <About/>
      <Tittle subTittle='OUR TEAM' tittle='Members of Staff'/>
      <Gallary/>
       <Tittle subTittle='TESTIMONIALS' tittle='what People Say'/>
      <Testimonials/>
      <Tittle subTittle='CONTACT US' tittle='Get in Touch'/>
      <Contact/>
      <Footer/>
    </>
  );
}

export default Home;