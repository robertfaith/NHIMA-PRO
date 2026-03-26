import './AboutSec.scss'
import about_img from '../../../assets/Q5.jpg'


const AboutSec = () => {
  return (
    <div className='about'>
        <div className='about-left'>
          <img className="about-img" src={about_img} alt="NHIMA overview" />
        </div>
        <div className='about-right'>
            <h1>Advancing Universal Health Coverage</h1>
            <p>
               The National Health Insurance Management Authority (NHIMA) is a statutory body established by the Government of the Republic of Zambia under the National Health Insurance Act No. 2 of 2018. The Authority is mandated to administer and manage the National Health Insurance Scheme (NHIS), a national initiative designed to provide sustainable healthcare financing and protect citizens from the financial burden associated with illness.
           </p>
            <p>
               The establishment of NHIMA marked a significant milestone in Zambia’s health sector reform agenda, aligning with the country’s commitment to achieving Universal Health Coverage (UHC). Through the National Health Insurance Scheme, the Authority pools financial contributions from members and employers to ensure equitable access to quality healthcare services across the country.
            </p>
            <p>
              Through innovation and responsible governance, NHIMA continues to expand access, enhance operational efficiency, and build a healthcare system that serves every citizen with fairness and dignity.
            </p>
            <h1>Our Vision</h1>
            <p>
              To be a trusted and sustainable national health insurance authority ensuring equitable access to quality healthcare services for every citizen.
            </p>
            <h1>Our Mission</h1>
            <p>
              To administer and manage the National Health Insurance Scheme effectively, providing financial protection and improving healthcare access for all Zambians.
            </p>

        </div>
    </div>
  )
}

export default AboutSec