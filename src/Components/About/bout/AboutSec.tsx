import './AboutSec.scss'
import about_img from '../../../assets/Q5.jpg'


const AboutSec = () => {
  return (
    <div className='about'>
        <div className='about-left'>
          <img className="about-img" src={about_img} alt="NHIMA overview" />
        </div>
        <div className='about-right'>
            <h2>About Us</h2>
            <h1>Advancing Universal Health Coverage</h1>
            <p>
               The National Health Insurance Management Authority (NHIMA) is mandated to provide sustainable healthcare financing through the National Health Insurance Scheme. Our purpose is to safeguard citizens from the financial risks associated with medical care while ensuring access to quality healthcare services.
            </p>
            <p>
               By registering members and employers, accrediting healthcare providers, and efficiently managing contributions and claims, NHIMA strengthens the foundation of universal health coverage. We are driven by integrity, service excellence, and a commitment to improving health outcomes nationwide.
            </p>
            <p>
              Through innovation and responsible governance, NHIMA continues to expand access, enhance operational efficiency, and build a healthcare system that serves every citizen with fairness and dignity.
            </p>

        </div>
    </div>
  )
}

export default AboutSec