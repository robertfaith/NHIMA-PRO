import './Loans.scss'
import img1 from '../../assets/GlobalMarket.jfif'
import Navbar from '../Home/Navbarr';

const Loans = () => {
  return (
    <>
        <Navbar />
    <div className="loans-banner" style={{ backgroundImage: `url(${img1})` }}>
        <div className="career-banner-overlay">
          <h1>Loans</h1>
            <p>We offer a variety of loan products to meet your needs.</p>
        </div>

    </div>
     </>
  )
}

export default Loans

 
