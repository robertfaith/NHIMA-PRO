import { FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SupportBanner = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d8a43] to-[#2fae66] rounded-[24px] px-6 py-14 md:px-12 flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left text-white">
        <div className="absolute -top-16 -right-16 w-[220px] h-[220px] rounded-full bg-[#f4b400]/25 blur-[10px] pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 relative z-10 text-2xl">
          <FaHeadset />
        </div>

        <div className="flex-1 relative z-10">
          <h2 className="font-['Sora','Segoe_UI',sans-serif] text-[clamp(1.5rem,3vw,2rem)] font-bold mb-2">
            Still need help?
          </h2>
          <p className="text-white/90 text-base max-w-[480px] mx-auto md:mx-0">
            Our support team is ready to assist with anything not covered here.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#0d8a43] font-semibold text-sm rounded-full px-7 py-3 shadow-[0_8px_24px_rgba(10,46,29,0.08)] transition-all duration-200 hover:bg-[#f4b400] hover:text-[#0a2e1d] active:scale-[0.98]"
          >
            Contact Support
          </Link>
          <a
          
            href="tel:909"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-[1.5px] border-white/60 text-white font-semibold text-sm rounded-full px-7 py-3 transition-all duration-200 hover:bg-white/12 hover:border-white active:scale-[0.98]"
          >
            Call Toll Free: 909
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportBanner;