import './Gallary.scss'
import image_1 from '../../assets/program-1.png'
import image_2 from '../../assets/program-2.png'
import image_3 from '../../assets/IMG-20241118-WA0021.jpg'
import image_4 from '../../assets/simbeye.jpg'



const Gallary = () => {
  return (
    <div className='Gallary'>
      <div className="Clap">
        <img src={image_1} alt="" />
      </div>
       <div className="gallarys">
        <img src={image_2} alt="" />
      </div>
       <div className="gallarys">
        <img src={image_3} alt="" />
      </div>
      <div className="gallarys">
        <img src={image_4} alt="" />
      </div>
    </div>
  )
}

export default Gallary
