import Navbar from '../Home/Navbarr'
import Section from './Section'
import ContactForm from './ContactForm'
import Footer from '../Home/Footer'
import Tittle from '../Home/Tittle';


const Contact = () => {
  return (
    <div>
      <Navbar />
      <Section />
      <Tittle subTittle='CONTACT US' tittle='Get in Touch'/>
      <ContactForm />
      <Footer/>
    </div>
  )
}

export default Contact
