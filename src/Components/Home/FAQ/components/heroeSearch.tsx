import { FaSearch } from 'react-icons/fa';
import type { FAQCategoryId, SearchChip } from '../faqType';

interface HeroSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  chips: SearchChip[];
  activeCategory: FAQCategoryId;
  onChipSelect: (category: FAQCategoryId) => void;
  resultCount: number;
}

const HeroSearch = ({
  query,
  onQueryChange,
  chips,
  activeCategory,
  onChipSelect,
  resultCount,
}: HeroSearchProps) => {
  return (
    <div className="max-w-[720px] mx-auto">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-2 bg-white rounded-full p-2 shadow-[0_20px_48px_rgba(10,46,29,0.14)]"
      >
        <FaSearch className="text-[#3c5049] ml-3 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for answers (e.g. how to register)"
          className="flex-1 min-w-0 bg-transparent border-none outline-none py-3 text-[#0a2e1d] placeholder:text-[#0a2e1d]/45"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-[#0d8a43] hover:bg-[#0a7038] text-white font-semibold text-sm rounded-full px-6 py-3 flex-shrink-0 transition-colors duration-200"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChipSelect(chip.category)}
            className={`text-sm font-medium rounded-full px-4 py-2 border transition-all duration-200 ${
              activeCategory === chip.category
                ? 'bg-[#f4b400] border-[#f4b400] text-[#0a2e1d]'
                : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white hover:-translate-y-0.5'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-white/75 text-center">
        {resultCount} {resultCount === 1 ? 'result' : 'results'} found
      </p>
    </div>
  );
};

export default HeroSearch;