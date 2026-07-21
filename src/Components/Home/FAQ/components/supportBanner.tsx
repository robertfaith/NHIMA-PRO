const SupportBanner = () => {
  return (
    <section className="support-banner" aria-labelledby="support-banner-heading">
      <div className="support-banner__inner">
        <span className="support-banner__glow" aria-hidden="true" />
        <span className="support-banner__icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 18h.01" />
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </span>
        <div className="support-banner__copy">
          <h2 id="support-banner-heading">Still need help?</h2>
          <p>Can&rsquo;t find the answer you&rsquo;re looking for? Our support team is ready to assist you.</p>
        </div>
        <div className="support-banner__actions">
          <a href="/contact" className="support-banner__primary">
            Contact Support
          </a>
          <a href="/contact" className="support-banner__secondary">
            Visit Contact Page
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportBanner;