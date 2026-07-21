import { useState } from 'react';
import type { FAQItem } from '../faqType';

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion = ({ items }: FAQAccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  if (items.length === 0) {
    return (
      <div className="faq-accordion__empty" role="status">
        No questions match your search. Try a different keyword or browse by category.
      </div>
    );
  }

  return (
    <div className="faq-accordion" id="faq-results">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `faq-panel-${item.id}`;
        const triggerId = `faq-trigger-${item.id}`;

        return (
          <div
            key={item.id}
            className={`faq-accordion-item${isOpen ? ' faq-accordion-item--open' : ''}`}
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                className="faq-accordion-item__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className="faq-accordion-item__question">{item.question}</span>
                <span className="faq-accordion-item__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              className="faq-accordion-item__panel"
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
            >
              <div className="faq-accordion-item__panel-inner">
                <p className="faq-accordion-item__answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;