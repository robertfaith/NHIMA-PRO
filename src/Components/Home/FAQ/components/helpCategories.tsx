import type { ReactElement } from 'react';
import type { FAQCategoryId, HelpTopic } from '../faqType';

interface HelpCategoriesProps {
  topics: HelpTopic[];
  onSelect: (category: FAQCategoryId) => void;
}

const icons: Record<string, ReactElement> = {
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  ),
  briefcase: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  ),
  hospital: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 21V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
      <path d="M9 21v-5h6v5" />
      <path d="M12 8v5M9.5 10.5h5" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v6c0 4.6-3 7.7-7 9-4-1.3-7-4.4-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  clipboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  ),
  card: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
};

const HelpCategories = ({ topics, onSelect }: HelpCategoriesProps) => {
  return (
    <section className="help-categories" aria-labelledby="help-categories-heading">
      <div className="faq-page__section-head">
        <span className="eyebrow">Browse by topic</span>
        <h2 id="help-categories-heading">What do you need help with?</h2>
        <p>Jump straight to the questions that matter to you.</p>
      </div>

      <div className="help-categories__grid">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className="help-card"
            onClick={() => onSelect(topic.targetCategory)}
          >
            <span className="help-card__icon" aria-hidden="true">
              {icons[topic.icon]}
            </span>
            <span className="help-card__title">{topic.title}</span>
            <span className="help-card__desc">{topic.description}</span>
            <span className="help-card__arrow">
              View questions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HelpCategories;
