
import Footer from '../Home/Footer';
import Navbar from '../Home/Navbarr';
import Tittle from '../Home/Tittle';
import BenefitsPage from './BenefitsPage';
import HeroSect from './HeroSect';

const Benefits = () => {
  return (
    <div>
      <Navbar />
      <HeroSect />
      <BenefitsPage />
      <Tittle subTittle='Benefits' tittle='We ensure that all citizens benefit from our services'/>
      <Footer />
    </div>
  )
}

export default Benefits;
