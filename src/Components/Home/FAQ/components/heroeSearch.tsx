import { useId } from 'react';
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
  const inputId = useId();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-search">
      <form className="hero-search__bar" role="search" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="visually-hidden">
          Search for a question
        </label>
        <span className="hero-search__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          id={inputId}
          type="text"
          className="hero-search__input"
          placeholder="Search for a question..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="hero-search__submit">
          Search
        </button>
      </form>

      <div className="hero-search__chips" role="group" aria-label="Popular topics">
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className={`hero-search__chip${
              activeCategory === chip.targetCategory ? ' hero-search__chip--active' : ''
            }`}
            onClick={() => onChipSelect(chip.targetCategory)}
            aria-pressed={activeCategory === chip.targetCategory}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {query.trim().length > 0 && (
        <p className="hero-search__result-count" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  );
};

export default HeroSearch;