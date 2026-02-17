import './Career.scss';
import img1 from '../../Assets/CR.jpg';
import Navbar from '../Home/Navbarr';

const Career = () => {
  return (
    <>
      <Navbar />
    <div className="career">
      {/* Banner Section */}
      <div className="career-banner" style={{ backgroundImage: `url(${img1})` }}>
        <div className="career-banner-overlay">
          <h1>Careers</h1>
          <p>We are looking for talented individuals to help us achieve our mission.</p>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="job-listings container">
        <h2>Open Positions</h2>
        {/* You can map your job data here */}
      </div>
    </div>
    </>
  )
}

export default Career;
