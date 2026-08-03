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
    <div className="font-['Inter','Segoe_UI',sans-serif] text-[#0a2e1d] bg-white scroll-smooth motion-reduce:scroll-auto">
      <Navbar />

      <HeroSect />

      <section
        className="bg-gradient-to-br from-[#0d8a43] to-[#2fae66] py-16 lg:py-20"
        aria-label="Search the help center"
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase font-medium text-white/80 mb-4 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-[#f4b400]">
            NHIMA Help Center
          </span>
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

      <section aria-labelledby="faq-section-heading" className="py-16 lg:py-24">
        <div className="max-w-[640px] mx-auto text-center mb-12 px-6">
          <span className="block font-mono text-xs tracking-[0.14em] uppercase font-medium text-[#0d8a43] mb-2">
            Help center
          </span>
          <h2
            id="faq-section-heading"
            className="font-['Sora','Segoe_UI',sans-serif] text-[clamp(1.7rem,3vw,2.4rem)] font-bold mb-3"
          >
            Browse frequently asked questions
          </h2>
          <p className="text-[#3c5049] text-[1.05rem] leading-[1.6]">
            Filter by category or search above to find what you need.
          </p>
        </div>

        <div
          id="faq-results"
          className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-16 items-start"
        >
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