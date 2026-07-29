import about_img from '../../assets/site_imgs3.jpg';
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="w-[90%] max-w-7xl mx-auto my-16 md:my-24 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-12">

      {/* Desktop / Tablet Image */}
      <div className="hidden md:block md:basis-[40%]">
        <img
          className="w-full rounded-2xl shadow-lg shadow-slate-900/10 block"
          src={about_img}
          alt="NHIMA overview"
        />
      </div>

      <div className="md:basis-[56%] text-center md:text-left">
        <h2 className="text-sm font-bold tracking-[2px] text-[#212ea0] mb-2.5">
          WELCOME TO NHIMA
        </h2>

        <h1 className="text-[2rem] lg:text-[2.2rem] xl:text-[3rem] font-semibold text-[#000f38] leading-tight mb-5">
          Advancing Universal Health Coverage
        </h1>

        <p className="text-sm md:text-base text-[#676767] leading-[1.8] mb-[18px] text-left">
          The National Health Insurance Management Authority (NHIMA) is mandated
          to provide sustainable healthcare financing through the National Health
          Insurance Scheme. Our purpose is to safeguard citizens from the
          financial risks associated with medical care while ensuring access to
          quality healthcare services.
        </p>

        {/* Mobile-only Image (appears after first paragraph) */}
        <img
          className="md:hidden w-full rounded-2xl my-5 shadow-lg shadow-slate-900/10"
          src={about_img}
          alt="NHIMA overview"
        />

        <p className="text-sm md:text-base text-[#676767] leading-[1.8] mb-[18px] text-left">
          By registering members and employers, accrediting healthcare providers,
          and efficiently managing contributions and claims, NHIMA strengthens
          the foundation of universal health coverage. We are driven by
          integrity, service excellence, and a commitment to improving health
          outcomes nationwide.
        </p>

        <p className="text-sm md:text-base text-[#676767] leading-[1.8] mb-[18px] text-left">
          Through innovation and responsible governance, NHIMA continues to
          expand access, enhance operational efficiency, and build a healthcare
          system that serves every citizen with fairness and dignity.
        </p>

        <Link
          to="/About"
          className="inline-block w-fit mt-2.5 bg-[#212ea0] text-white no-underline px-7 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-[#1a237e] hover:-translate-y-0.5"
        >
          Read More
        </Link>
      </div>

    </div>
  );
};

export default About;