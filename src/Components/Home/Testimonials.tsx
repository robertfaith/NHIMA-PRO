import './testimonials.scss';

import User_1 from '../../assets/reg.jpg';
import User_2 from '../../assets/regist.jpg';
import User_3 from '../../assets/simbeye.jpg';
import User_4 from '../../assets/hero.png';

const testimonials = [
  {
    image: User_1,
    name: "Naomi Nyirongo",
    location: "LBTC, Lusaka",
    text: "Registering with NHIMA gave my family real peace of mind. When my son needed hospital care, our contributions covered it without the stress of finding money on the spot."
  },
  {
    image: User_2,
    name: "Racheal Phiri",
    location: "LBTC, Lusaka",
    text: "As a small business owner, I wasn't sure health insurance was for people like me. NHIMA made registration simple and now my whole household is covered."
  },
  {
    image: User_3,
    name: "Nicholas Pikiti",
    location: "Libala, Lusaka",
    text: "The claims process was much faster than I expected. NHIMA's support team walked me through everything and I felt genuinely taken care of."
  },
  {
    image: User_4,
    name: "Blessings Makasa",
    location: "Woodlands, Lusaka",
    text: "Having NHIMA behind us means we no longer delay hospital visits out of fear of the cost. It's changed how my family thinks about healthcare."
  }
];

const Testimonials = () => {
  // duplicate so the loop has no visible seam
  const scrollingTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="testimonials">
      <div className="slider">
        <div className="slider-track">
          {scrollingTestimonials.map((item, index) => (
            <div className="slide" key={`${item.name}-${index}`}>
              <div className="user-info">
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.location}</span>
                </div>
              </div>

              <p>{item.text}</p>

              <div className="rating">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;