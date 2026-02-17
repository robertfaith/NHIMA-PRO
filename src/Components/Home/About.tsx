import './About.scss'
import about_img from '../../assets/site_imgs3.jpg'
const About = () => {
  return (
    <div className='about'>
        <div className='about-left'>
            <img src={about_img} alt="" />
        </div>
        <div className='about-right'>
            <h3>About Us</h3>
            <h2>Empowering Financial Inclusion</h2>
            <p>
               AB Bank Zambia is a member of AccessHolding, a global banking group focused on serving micro, small, and medium enterprises. Since our establishment, we have been dedicated to promoting financial inclusion by providing simple, affordable, and transparent banking services to communities across Zambia.
            </p>
            <p>
               Our mission is to empower individuals and businesses by offering a range of financial products, including savings accounts, loans, and digital banking solutions. We believe in fostering economic growth and improving the quality of life for our customers through responsible banking practices.
            </p>
            <p>
               At AB Bank Zambia, we are committed to innovation and excellence, continuously adapting to the evolving needs of our customers. Our team of experienced professionals is passionate about delivering personalized service and building long-term relationships with our clients.
            </p>
            <button className='btn-primary'>Read More</button>
        </div>
    </div>
  )
}

export default About
