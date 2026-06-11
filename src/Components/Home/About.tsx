import './About.scss';
import about_img from '../../assets/site_imgs3.jpg';
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className='about'>

      {/* Desktop / Tablet Image */}
      <div className='about-left'>
        <img
          className="about-img desktop-img"
          src={about_img}
          alt="NHIMA overview"
        />
      </div>

      <div className='about-right'>
        <h2>WELCOME TO NHIMA</h2>
        <h1>Advancing Universal Health Coverage</h1>

        <p>
          The National Health Insurance Management Authority (NHIMA) is mandated
          to provide sustainable healthcare financing through the National Health
          Insurance Scheme. Our purpose is to safeguard citizens from the
          financial risks associated with medical care while ensuring access to
          quality healthcare services.
        </p>

        {/* Mobile-only Image (appears after first paragraph) */}
        <img
          className="about-img mobile-img"
          src={about_img}
          alt="NHIMA overview"
        />

        <p>
          By registering members and employers, accrediting healthcare providers,
          and efficiently managing contributions and claims, NHIMA strengthens
          the foundation of universal health coverage. We are driven by
          integrity, service excellence, and a commitment to improving health
          outcomes nationwide.
        </p>

        <p>
          Through innovation and responsible governance, NHIMA continues to
          expand access, enhance operational efficiency, and build a healthcare
          system that serves every citizen with fairness and dignity.
        </p>

        <Link to="/About" className="btn-primary">
          Read More
        </Link>
      </div>

    </div>
  );
};

export default About;