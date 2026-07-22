import { useMemo, useState } from 'react';
import Navbar from '../Navbarr';
import Footer from '../Footer';
import HeroSect from './HeroSect';
import HeroSearch from './components/heroeSearch';
import HelpCategories from './components/helpCategories';
import FAQSidebar from './components/faqSidebar';
import FAQAccordion from './components/FAQAccordion';
import SupportBanner from './components/supportBanner';
import { faqCategories, faqItems, helpTopics, searchChips } from './faqData';
import type { FAQCategoryId } from './faqType';
import './Faq.scss';

const matchesQuery = (haystack: string, query: string) =>
  haystack.toLowerCase().includes(query.trim().toLowerCase());

const FAQ = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQCategoryId>('all');

  const handleCategorySelect = (category: FAQCategoryId) => {
    setActiveCategory(category);
    document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChipSelect = (category: FAQCategoryId) => {
    setActiveCategory((current) => (current === category ? 'all' : category));
  };

  // Items filtered by search only — used to compute per-category counts
  // so the sidebar reflects the current search term.
  const searchFiltered = useMemo(() => {
    if (!query.trim()) return faqItems;
    return faqItems.filter((item) => {
      const haystack = [item.question, item.answer, ...(item.keywords ?? [])].join(' ');
      return matchesQuery(haystack, query);
    });
  }, [query]);

  const visibleItems = useMemo(() => {
    if (activeCategory === 'all') return searchFiltered;
    return searchFiltered.filter((item) => item.category === activeCategory);
  }, [searchFiltered, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<FAQCategoryId, number> = {
      all: searchFiltered.length,
      registration: 0,
      members: 0,
      employers: 0,
      providers: 0,
      benefits: 0,
      claims: 0,
      payments: 0,
      account: 0,
      general: 0,
    };
    searchFiltered.forEach((item) => {
      counts[item.category] += 1;
    });
    return counts;
  }, [searchFiltered]);

  return (
    <div className="faq-page">
      <Navbar />

      <HeroSect />

      <section className="faq-search-band" aria-label="Search the help center">
        <div className="faq-search-band__inner">
          <span className="eyebrow">NHIMA Help Center</span>
          <HeroSearch
            query={query}
            onQueryChange={setQuery}
            chips={searchChips}
            activeCategory={activeCategory}
            onChipSelect={handleChipSelect}
            resultCount={searchFiltered.length}
          />
        </div>
      </section>

      <HelpCategories topics={helpTopics} onSelect={handleCategorySelect} />

      <section aria-labelledby="faq-section-heading">
        <div className="faq-page__section-head">
          <span className="eyebrow">Help center</span>
          <h2 id="faq-section-heading">Browse frequently asked questions</h2>
          <p>Filter by category or search above to find what you need.</p>
        </div>

        <div className="faq-body">
          <FAQSidebar
            categories={faqCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            counts={categoryCounts}
          />
          <FAQAccordion items={visibleItems} />
        </div>
      </section>

      <SupportBanner />

      <Footer />
    </div>
  );
};

export default FAQ;
