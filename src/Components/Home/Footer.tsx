import './Footer.scss'
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";

const Footer = () => {
  return (
    <div className="footer">
      <div className="sb_footer section_padding">
        <div className="sb_footer_links">

          {/* ── About NHIMA ── */}
          <div className="sb_footer-link_div">
            <h4>About NHIMA</h4>
            <a href="/about"><p>About Us</p></a>
            <a href="/mission"><p>Our Mission & Vision</p></a>
            <a href="/board"><p>Board of Directors</p></a>
            <a href="/management"><p>Management Team</p></a>
            <a href="/careers"><p>Careers</p></a>
            <a href="/news"><p>News & Updates</p></a>
          </div>

          {/* ── Member Services ── */}
          <div className="sb_footer-link_div">
            <h4>Member Services</h4>
            <a href="/register"><p>Register as a Member</p></a>
            <a href="/contributions"><p>Check Contributions</p></a>
            <a href="/claims"><p>File a Claim</p></a>
            <a href="/benefits"><p>Benefits & Eligibility</p></a>
            <a href="/card"><p>NHIMA Card</p></a>
            <a href="/portal"><p>Member Portal Login</p></a>
          </div>

          {/* ── Employer Services ── */}
          <div className="sb_footer-link_div">
            <h4>Employer Services</h4>
            <a href="/employer/register"><p>Register as an Employer</p></a>
            <a href="/employer/portal"><p>Employer Portal</p></a>
            <a href="/employer/remittance"><p>Submit Remittances</p></a>
            <a href="/employer/compliance"><p>Compliance Guidelines</p></a>
            <a href="/employer/penalties"><p>Penalties & Surcharges</p></a>
            <a href="/employer/faq"><p>Employer FAQs</p></a>
          </div>

          {/* ── Resources ── */}
          <div className="sb_footer-link_div">
            <h4>Resources</h4>
            <a href="/downloads"><p>Forms & Downloads</p></a>
            <a href="/legislation"><p>NHIMA Act & Legislation</p></a>
            <a href="/guidelines"><p>Contribution Guidelines</p></a>
            <a href="/reports"><p>Annual Reports</p></a>
            <a href="/faqs"><p>FAQs</p></a>
            <a href="/glossary"><p>Glossary of Terms</p></a>
          </div>

          {/* ── Contact & Support ── */}
          <div className="sb_footer-link_div">
            <h4>Contact & Support</h4>
            <a href="/contact"><p>Contact Us</p></a>
            <a href="/branches"><p>Find a Branch</p></a>
            <a href="/complaint"><p>Lodge a Complaint</p></a>
            <a href="/support"><p>Help Center</p></a>
            <p className="footer_contact_info"><FaPhoneAlt /> +260 211 123 456</p>
            <p className="footer_contact_info">
              <MdEmail /> info@nhima.co.zm
            </p>

            <p className="footer_contact_info">
              <MdAccessTime /> Mon–Fri: 08:00–17:00
                </p>  
          </div>

          {/* ── Follow Us ── */}
          <div className="sb_footer-link_div">
            <h4>Follow Us</h4>
            <a href="https://facebook.com/nhima" target="_blank" rel="noreferrer">
              <p><FaFacebook /> Facebook</p>
            </a>
            <a href="https://twitter.com/nhima" target="_blank" rel="noreferrer">
              <p><FaSquareXTwitter /> Twitter / X</p>
            </a>
            <a href="https://linkedin.com/company/nhima" target="_blank" rel="noreferrer">
              <p><FaLinkedin /> LinkedIn</p>
            </a>
            <a href="https://youtube.com/nhima" target="_blank" rel="noreferrer">
              <p><FaYoutube /> YouTube</p>
            </a>
            <a href="https://instagram.com/nhima" target="_blank" rel="noreferrer">
              <p><FaInstagram /> Instagram</p>
            </a>
          </div>

        </div>

        {/* ── Partner Logos Strip ── */}
        <div className="sb_footer_partners">
          <p>In partnership with:</p>
          <div className="sb_footer_partner_logos">
            <span>Ministry of Health</span>
            <span>•</span>
            <span>Bank of Zambia</span>
            <span>•</span>
            <span>NAPSA</span>
            <span>•</span>
            <span>ZRA</span>
            <span>•</span>
            <span>PACRA</span>
          </div>
        </div>

        <hr />

        {/* ── Bottom Bar ── */}
        <div className="sb_footer_below">
          <div className="sb_footer_copyright">
            <p>
              © {new Date().getFullYear()} National Health Insurance Management Authority (NHIMA).
              All rights reserved. Regulated under the National Health Insurance Act No. 2 of 2018.
            </p>
          </div>
          <div className="sb_footer_below_links">
            <a href="/terms"><p>Terms & Conditions</p></a>
            <a href="/privacy"><p>Privacy Policy</p></a>
            <a href="/sitemap"><p>Sitemap</p></a>
            <a href="/accessibility"><p>Accessibility</p></a>
            <a href="/whistleblower"><p>Whistleblower Policy</p></a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;