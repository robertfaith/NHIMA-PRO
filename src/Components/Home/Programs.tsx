import { Link } from 'react-router-dom'
import './Programs.scss'
import program_1 from '../../assets/New-ABZ-Thumbnails.jpg'
import program_2 from '../../assets/New-ABZ-Thumbnails2.jpg'
import program_3 from '../../assets/program-3.png'

import program_icon_1 from '../../assets/cooperation.png'
import program_icon_2 from '../../assets/culinary.png'
import program_icon_3 from '../../assets/engineer-degree.png'

const programsData = [
  {
    image: program_1,
    icon: program_icon_1,
    label: 'Benefits',
    path: '/benefits'
  },
  {
    image: program_2,
    icon: program_icon_2,
    label: 'Facilities',
    path: '/facilities'
  },
  {
    image: program_3,
    icon: program_icon_3,
    label: 'FAQ',
    path: '/faq'
  }
]

const Programs = () => {
  return (
    <div className='programs'>
      {programsData.map((program, idx) => (
        <Link to={program.path} className="program" key={idx}>
          <img src={program.image} alt={program.label} />
          <div className="caption">
            <img src={program.icon} alt={program.label + " icon"} />
            <p>{program.label}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Programs