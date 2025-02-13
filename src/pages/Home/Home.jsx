import React, { useState, useEffect, useRef } from 'react';
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
import { properties } from '../../data/properties';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import Header from '../../components/Header/Header';
import './Home.css';

const Home = () => {
  const [visibleProperties, setVisibleProperties] = useState(6);
  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!showMoreClicked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleProperties(prev => Math.min(prev + 6, properties.length));
            setLoading(false);
          }, 500); // Simulate loading delay
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [showMoreClicked, loading]);

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
        <section className="office-listings">
          <h2>Available Offices</h2>
          <div className="property-grid">
            {properties.slice(0, visibleProperties).map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {!showMoreClicked && visibleProperties < properties.length && (
            <button 
              className="show-more-btn"
              onClick={() => setShowMoreClicked(true)}
            >
              Show More
            </button>
          )}
          {showMoreClicked && visibleProperties < properties.length && (
            <div ref={observerTarget} className="loading-indicator">
              Loading more offices...
            </div>
          )}
        </section>

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

      </main>

      <footer className="sticky-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Office Plus</h3>
            <p>Your premium office space solution</p>
          </div>
          <div className="footer-section contact-info">
            <p><FontAwesomeIcon icon={faPhone} /> (123) 456-7890</p>
            <p><FontAwesomeIcon icon={faEnvelope} /> info@officeplus.com</p>
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
