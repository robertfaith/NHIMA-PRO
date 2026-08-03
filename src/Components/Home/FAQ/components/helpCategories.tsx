import { FaChevronRight } from 'react-icons/fa';
import type { FAQCategoryId, HelpTopic } from '../faqType';

interface HelpCategoriesProps {
  topics: HelpTopic[];
  onSelect: (category: FAQCategoryId) => void;
}

const HelpCategories = ({ topics, onSelect }: HelpCategoriesProps) => {
  return (
    <section className="bg-[#f7f9f8] py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.category)}
            className="group text-left w-full flex flex-col gap-4 bg-white border border-[rgba(10,46,29,0.1)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(10,46,29,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(10,46,29,0.14)] hover:border-[#0d8a43]/25 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#f4b400] focus-visible:outline-offset-2"
          >
            <div className="w-[52px] h-[52px] rounded-lg bg-[#0d8a43]/[0.08] text-[#0d8a43] flex items-center justify-center text-xl transition-colors duration-300 group-hover:bg-[#0d8a43] group-hover:text-white">
              {topic.icon}
            </div>

            <h3 className="font-['Sora','Segoe_UI',sans-serif] text-[1.1rem] font-semibold text-[#0a2e1d]">
              {topic.title}
            </h3>

            <p className="text-[0.92rem] text-[#3c5049] leading-[1.55] flex-1">
              {topic.description}
            </p>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0d8a43]">
              Browse topics
              <FaChevronRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HelpCategories;