import { Link } from 'react-router-dom';
import program_1 from '../../assets/New-ABZ-Thumbnails.jpg';
import program_2 from '../../assets/New-ABZ-Thumbnails2.jpg';
import program_3 from '../../assets/program-3.png';

import program_icon_1 from '../../assets/cooperation.png';
import program_icon_2 from '../../assets/culinary.png';
import program_icon_3 from '../../assets/engineer-degree.png';

interface Program {
  image: string;
  icon: string;
  label: string;
  path: string;
}

const programsData: Program[] = [
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
];

const Programs = () => {
  return (
    <div className="w-[95%] md:w-[90%] mx-auto my-5 grid grid-cols-1 md:grid-cols-3 gap-4 font-['Poppins',sans-serif]">
      {programsData.map((program, idx) => (
        <Link
          to={program.path}
          key={idx}
          className="group relative block w-full overflow-hidden rounded-[10px] shadow-md"
        >
          <img
            src={program.image}
            alt={program.label}
            className="w-full h-64 md:h-72 object-cover block transition-transform duration-500 ease-out group-hover:scale-110"
          />

          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-white text-center
              bg-gradient-to-t from-[rgba(0,15,152,0.75)] via-[rgba(0,15,152,0.35)] to-transparent
              opacity-0 translate-y-3 transition-all duration-500 ease-out
              group-hover:opacity-100 group-hover:translate-y-0"
          >
            <img
              src={program.icon}
              alt={`${program.label} icon`}
              className="w-12"
            />
            <p className="text-lg font-semibold tracking-wide">{program.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Programs;