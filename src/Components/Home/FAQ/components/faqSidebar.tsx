import type { FAQCategory, FAQCategoryId } from '../faqType';

interface FAQSidebarProps {
  categories: FAQCategory[];
  activeCategory: FAQCategoryId;
  onSelect: (category: FAQCategoryId) => void;
  counts: Record<FAQCategoryId, number>;
}

const FAQSidebar = ({ categories, activeCategory, onSelect, counts }: FAQSidebarProps) => {
  return (
    <nav className="faq-sidebar" aria-label="FAQ categories">
      <span className="faq-sidebar__title">Categories</span>
      <ul className="faq-sidebar__list">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={`faq-sidebar__item${
                activeCategory === category.id ? ' faq-sidebar__item--active' : ''
              }`}
              onClick={() => onSelect(category.id)}
              aria-current={activeCategory === category.id ? 'true' : undefined}
            >
              <span>{category.label}</span>
              <span className="faq-sidebar__count">{counts[category.id] ?? 0}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FAQSidebar;