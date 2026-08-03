import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import type { FAQItem } from '../faqType';

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion = ({ items }: FAQAccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-white border border-[rgba(10,46,29,0.1)] rounded-2xl shadow-[0_2px_8px_rgba(10,46,29,0.06)] p-12 text-center text-[#3c5049]">
        No results match your search. Try a different term or category.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-white border border-[rgba(10,46,29,0.1)] rounded-2xl shadow-[0_2px_8px_rgba(10,46,29,0.06)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 bg-transparent border-none text-left px-5 py-4 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#f4b400] focus-visible:outline-offset-2"
            >
              <span
                className={`text-[1rem] font-semibold leading-[1.4] ${
                  isOpen ? 'text-[#0d8a43]' : 'text-[#0a2e1d]'
                }`}
              >
                {item.question}
              </span>

              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isOpen ? 'bg-[#0d8a43] text-white' : 'bg-[#eef2f0] text-[#0d8a43]'
                }`}
              >
                <FaPlus
                  className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                />
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5">
                <p className="text-[0.95rem] leading-[1.7] text-[#3c5049] max-w-[68ch]">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;