import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { propertyService } from '../../services/api';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import Header from '../../components/Header/Header';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [visibleProperties, setVisibleProperties] = useState(6);
  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);

  // Fetch properties when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getAllProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Failed to load properties. Please try again later.');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle infinite scroll
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
          <Link to="/offices" className="hero-cta">Browse Offices</Link>
        </div>
      </div>

      <Header onSearch={handleSearch} />
      
      <main>
        <section className="office-listings">
          <h2>Available Offices</h2>
      <div className="property-grid">
        {error ? (
          <div className="error-message">{error}</div>
        ) : loading && properties.length === 0 ? (
          <div className="loading-message">Loading properties...</div>
        ) : (
          properties.slice(0, visibleProperties).map(property => (
            <PropertyCard key={property._id} property={property} />
          ))
        )}
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
