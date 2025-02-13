import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWifi, 
  faClock, 
  faCoffee, 
  faShieldAlt,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faTwitter, 
  faLinkedin 
} from '@fortawesome/free-brands-svg-icons';
import Header from '../../components/Header/Header';
import './Home.css';

const Home = () => {
  const handleSearch = (searchTerm) => {
    window.location.href = `/offices?search=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Office Space</h1>
          <p className="hero-subtitle">Discover premium office spaces designed for productivity and success</p>
          <Link to="/offices" className="cta-button">View Available Offices</Link>
        </div>
      </div>

      <Header onSearch={handleSearch} />
      
      <main>
        <section className="features">
          <h2>Why Choose Office Plus?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FontAwesomeIcon icon={faWifi} />
              <h3>High-Speed Internet</h3>
              <p>Enterprise-grade connectivity in all locations</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faClock} />
              <h3>24/7 Access</h3>
              <p>Work whenever suits you best</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faCoffee} />
              <h3>Premium Amenities</h3>
              <p>Fully equipped kitchens and break rooms</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faShieldAlt} />
              <h3>Secure Access</h3>
              <p>State-of-the-art security systems</p>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <h2>About Us</h2>
          <p>Office Plus provides premium office spaces designed to enhance productivity and foster success. From private offices to collaborative workspaces, we offer flexible solutions for businesses of all sizes.</p>
        </section>

        <section className="contact" id="contact">
          <h2>Contact Us</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <select name="inquiry-type" required>
              <option value="">Select Inquiry Type</option>
              <option value="viewing">Schedule Viewing</option>
              <option value="pricing">Pricing Information</option>
              <option value="availability">Check Availability</option>
              <option value="other">Other</option>
            </select>
            <textarea placeholder="Message" required />
            <button type="submit">Send Message</button>
          </form>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Office Plus</h3>
            <p>Your premium office space solution</p>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p><FontAwesomeIcon icon={faPhone} /> (123) 456-7890</p>
            <p><FontAwesomeIcon icon={faEnvelope} /> info@officeplus.com</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://facebook.com/officeplus" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://twitter.com/officeplus" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://linkedin.com/company/officeplus" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Office Plus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
