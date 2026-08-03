import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaStethoscope,
  FaXRay,
  FaPills,
  FaProcedures,
  FaBaby,
  FaBed,
  FaBrain,
} from 'react-icons/fa';


interface BenefitCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefitCategories: BenefitCategory[] = [
  {
    icon: <FaStethoscope />,
    title: 'Consultations & OPD',
    description: 'Outpatient visits and fast-track consultation services at accredited facilities.'
  },
  {
    icon: <FaXRay />,
    title: 'Diagnostics & Investigations',
    description: 'Laboratory tests, X-ray, CT, MRI, ultrasound and mammogram services.'
  },
  {
    icon: <FaPills />,
    title: 'Pharmaceuticals & Blood Products',
    description: 'Medicines prescribed from the National Essential Medicines List, plus blood products where indicated.'
  },
  {
    icon: <FaProcedures />,
    title: 'Surgical Services',
    description: 'Minor, major, orthopedic, ENT and diagnostic surgical procedures.'
  },
  {
    icon: <FaBaby />,
    title: 'Maternity & Newborn Care',
    description: 'Normal and caesarean deliveries, obstetric and gynecological care, and newborn/pediatric services.'
  },
  {
    icon: <FaBed />,
    title: 'Inpatient Care',
    description: 'Hospital admission, ward stay, and High Dependency / Intensive Care Unit services.'
  },
  {
    icon: <FaBrain />,
    title: 'Mental Health',
    description: 'Coverage for chronic conditions such as schizophrenia, and affective disorders like mania and depression.'
  }
];

const eligibilityPoints: string[] = [
  'All Zambians and established residents aged 18+ are eligible to register.',
  'Members aged 65 and above, and indigent or disabled persons, are exempt from contributing but remain registered and covered.',
  'Citizens under 18 don\u2019t pay but are covered as registered beneficiaries.',
  'You can register a spouse and up to 5 dependants under 18 at no extra cost.'
];

const BenefitsPage: React.FC = () => {
  return (
    <div className="font-['Poppins',sans-serif] text-[#1a1a2e]">
     

      {/* Overview */}
      <section className="w-[90%] max-w-5xl mx-auto text-center py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#003f6b]">
          Comprehensive Cover, For Every Member
        </h2>
        <p className="text-[0.95rem] sm:text-base leading-relaxed text-[#4a4a5e] max-w-3xl mx-auto">
          All paid-up and valid NHIMA members receive access to the same benefits,
          regardless of socio-economic status, delivered in a cashless manner at
          accredited facilities across Zambia.
        </p>
      </section>

      {/* Benefit categories grid */}
      <section className="w-[90%] max-w-6xl mx-auto pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitCategories.map((category, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white bg-[#1c8ee0] group-hover:bg-[#003f6b] transition-colors duration-300 mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#003f6b]">
                {category.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#4a4a5e]">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-[#f4f8fc] py-16">
        <div className="w-[90%] max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#003f6b]">
            Who Is Eligible?
          </h2>
          <ul className="space-y-4">
            {eligibilityPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-[#1c8ee0] flex-shrink-0" />
                <span className="text-sm sm:text-base text-[#333] leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Limits & exclusions */}
      <section className="w-[90%] max-w-4xl mx-auto py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-[#003f6b]">
          Good to Know
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[#4a4a5e] text-center max-w-2xl mx-auto">
          Outpatient visits are limited to 3 per health event at secondary and
          tertiary hospitals, unless the condition is chronic. Some services may
          be excluded from cover as prescribed by the Minister of Health. For a
          full breakdown, see our{' '}
          <Link to="/faq" className="text-[#1c8ee0] underline hover:text-[#003f6b]">
            FAQs
          </Link>.
        </p>
      </section>

      {/* How to access benefits */}
      <section className="bg-[#003f6b] text-white py-16">
        <div className="w-[90%] max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">
            Accessing Your Benefits Is Simple
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', label: 'Find an accredited facility', to: '/facilities' },
              { step: '2', label: 'Present your NHIMA card', to: null },
              { step: '3', label: 'Receive cashless service', to: null },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1c8ee0] flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <p className="text-sm sm:text-base">
                  {item.to ? (
                    <Link to={item.to} className="underline hover:text-white/80">
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#003f6b]">
          Not yet registered?
        </h2>
        <Link
          to="/register"
          className="inline-block bg-[#1c8ee0] hover:bg-[#003f6b] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5"
        >
          Register as a Member
        </Link>
      </section>
    </div>
  );
};

export default BenefitsPage;