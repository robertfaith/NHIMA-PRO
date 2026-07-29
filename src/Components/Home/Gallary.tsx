import image_1 from '../../assets/ZRA_Logo.png';
import image_2 from '../../assets/MoH_Logo.jpg';
import image_3 from '../../assets/BOZ_Logo.png';
import image_4 from '../../assets/NAPSA_Logo.jpg';
import image_5 from '../../assets/pacra_logo.png';

const partners = [
  { name: 'Zambia Revenue Authority', logo: image_1 },
  { name: 'Ministry of Health', logo: image_2 },
  { name: 'Bank of Zambia', logo: image_3 },
  { name: 'NAPSA', logo: image_4 },
  { name: 'PACRA', logo: image_5 },
];

const Gallary = () => {
  // duplicate the array so the loop has no visible seam
  const scrollingPartners = [...partners, ...partners];

  return (
    <div className="my-[70px] mx-auto w-[90%] overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex items-center w-max animate-gallery-scroll hover:[animation-play-state:paused]">
        {scrollingPartners.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex flex-col items-center justify-center mx-10 shrink-0"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-[140px] h-20 object-contain rounded-[10px]"
            />
            <span className="mt-2.5 font-['Poppins',sans-serif] text-sm font-medium text-[#555] whitespace-nowrap">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallary;