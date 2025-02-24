import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { propertyService } from '../../services/property';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import Header from '../../components/Header/Header';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const observerTarget = useRef(null);

  // Fetch properties
  const fetchProperties = async (page, search = searchTerm) => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties(page, 10, search);
      
      if (!data || !data.properties) {
        throw new Error('Invalid response from server');
      }

      setProperties(prev => page === 1 ? data.properties : [...prev, ...data.properties]);
      setTotalPages(data.pagination.pages);
      setError(null);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProperties(1, '');
  }, []);

  // Reset pagination and fetch properties when search term changes
  useEffect(() => {
    setCurrentPage(1);
    setProperties([]);
    fetchProperties(1, searchTerm);
  }, [searchTerm]);

  // Handle infinite scroll
  useEffect(() => {
    if (loading || currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, currentPage, totalPages]);

  // Fetch more properties when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchProperties(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Office Space</h1>
          <p className="hero-subtitle">Discover premium office spaces designed for productivity and success</p>
        </div>
      </div>

      <Header onSearch={handleSearch} searchValue={searchTerm} />
      
      <main className={searchTerm ? 'with-search' : ''}>
        <section className="office-listings">
          <h2>Available Offices</h2>
          <div className="property-grid">
            {error ? (
              <div className="error-message" role="alert">{error}</div>
            ) : properties.length === 0 && loading ? (
              <div className="loading-message" role="status">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="no-results" role="status">
                {searchTerm ? `No properties found for "${searchTerm}"` : 'No properties found'}
              </div>
            ) : (
              <>
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
                {currentPage < totalPages && (
                  <div ref={observerTarget} className="loading-indicator" role="status">
                    {loading ? 'Loading more offices...' : 'Scroll for more'}
                  </div>
                )}
              </>
            )}
          </div>
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
