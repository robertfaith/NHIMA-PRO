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
    label: 'Personal Banking'
  },
  {
    image: program_2,
    icon: program_icon_2,
    label: 'Business Banking'
  },
  {
    image: program_3,
    icon: program_icon_3,
    label: 'Education Loans'
  }
]

const Programs = () => {
  return (
    <div className='programs'>
      {programsData.map((program, idx) => (
        <div className="program" key={idx}>
          <img src={program.image} alt={program.label} />
          <div className="caption">
            <img src={program.icon} alt={program.label + " icon"} />
            <p>{program.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Programs