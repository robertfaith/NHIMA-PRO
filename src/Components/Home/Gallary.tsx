import './Gallary.scss'
import image_1 from '../../assets/ZRA_Logo.png'
import image_2 from '../../assets/MoH_Logo.jpg'
import image_3 from '../../assets/BOZ_Logo.png'
import image_4 from '../../assets/NAPSA_Logo.jpg'
import image_5 from '../../assets/pacra_logo.png'

const partners = [
  { name: 'Zambia Revenue Authority', logo: image_1 },
  { name: 'Ministry of Health', logo: image_2 },
  { name: 'Bank of Zambia', logo: image_3 },
  { name: 'NAPSA', logo: image_4 },
  { name: 'PACRA', logo: image_5 },
]

const Gallary = () => {
  // duplicate the array so the loop has no visible seam
  const scrollingPartners = [...partners, ...partners]

  return (
    <div className='Gallary'>
      <div className='gallary-track'>
        {scrollingPartners.map((partner, index) => (
          <div className='gallarys' key={`${partner.name}-${index}`}>
            <img src={partner.logo} alt={partner.name} />
            <span>{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallary