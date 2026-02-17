import './Footer.scss'
const Footer = () => {
  return (
    <div className = "footer">
        <div className = "sb_footer section_padding">
            <div className="sb_footer_link">
                <div className="sb_footer-link_div">
                    <h4>About Us</h4>
                    <p>Our company is dedicated to providing the best service possible.</p>
                    <a href="/About">Learn More</a>
                    <a href="/Contact">
                    <p>Contact Us</p>
                    </a>
                    <a href="/Privacy">
                        <p>Privacy Policy</p>
                    </a>
                    <a href="/Terms">
                    <p>Terms of Service</p>
                    </a>
                    <a href="/Support">
                        <p>Support</p>
                    </a>
                </div>
                <div className="sb_footer-link_div">
                    <h4>Resources</h4>
                     <a href="/resources">
                     <p>Resource Center</p>
                     </a>
                    <a href="/testimonials">
                    <p>Testimonials</p>
                    </a>
                    <a href="/Pr">
                        <p>Privacy Policy</p>
                    </a>
                </div>
                 <div className="sb_footer-link_div">
                    <h4>Partners</h4>
                    <a href="/partners">
                        <p>Our Partners</p>
                    </a>
                    <a href="/affiliates">
                        <p>Affiliates</p>
                    </a>
                    <a href="/sponsors">
                        <p>Sponsors</p>
                    </a>
                 </div>
                 <div className="sb_footer-link_div">
                    <h4>Company</h4>
                    <a href="/careers">
                        <p>Careers</p>
                    </a>
                    <a href="/press">
                        <p>Press</p>
                    </a>
                 </div>
                 <div className="sb_footer-link_div">
                    <h4>Social Media</h4>
                    <a href="/facebook">
                        <p>Facebook</p>
                    </a>
                    <a href="/twitter">
                        <p>Twitter</p>
                    </a>
                    <a href="/instagram">
                        <p>Instagram</p>
                    </a>
                 </div>
                 <hr></hr>
                 <div className="sb_footer_below">
                    <div className="sb_footer_copyright">
                        <p>
                            @{new Date().getFullYear()} Company. All rights reserved.
                        </p>
                    </div>
                    <div className="sb_footer_below_links">
                        <a href="/terms">
                            <p>Terms & Conditions</p>
                        </a>
                        <a href="/privacy">
                            <p>Privacy</p>
                        </a>
                        <a href="/sitemap">
                            <p>Sitemap</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Footer
