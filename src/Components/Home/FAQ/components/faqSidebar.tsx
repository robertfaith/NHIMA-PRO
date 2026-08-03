import type { FAQCategory, FAQCategoryId } from '../faqType';

interface FAQSidebarProps {
  categories: FAQCategory[];
  activeCategory: FAQCategoryId;
  onSelect: (category: FAQCategoryId) => void;
  counts: Record<FAQCategoryId, number>;
}

const FAQSidebar = ({ categories, activeCategory, onSelect, counts }: FAQSidebarProps) => {
  return (
    <aside className="lg:sticky lg:top-6">
      <span className="hidden lg:block font-mono text-xs tracking-[0.14em] uppercase font-medium text-[#3c5049] mb-3">
        Categories
      </span>

      <ul className="list-none m-0 p-0 flex flex-row flex-wrap lg:flex-col lg:flex-nowrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <li key={category.id} className="w-full lg:w-auto">
              <button
                type="button"
                onClick={() => onSelect(category.id)}
                className={`w-full lg:w-auto flex items-center justify-between gap-2 text-left rounded-lg border px-4 py-2.5 text-[0.92rem] font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#f4b400] focus-visible:outline-offset-2 ${
                  isActive
                    ? 'bg-[#0d8a43] border-[#0d8a43] text-white'
                    : 'bg-white border-[rgba(10,46,29,0.1)] text-[#3c5049] hover:border-[#0d8a43] hover:text-[#0d8a43]'
                }`}
              >
                <span>{category.label}</span>
                <span
                  className={`font-mono text-xs ${
                    isActive ? 'text-white/80' : 'text-[#0a2e1d]/40'
                  }`}
                >
                  {counts[category.id]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default FAQSidebar;