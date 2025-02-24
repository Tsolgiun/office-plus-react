import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chatbot from '../../components/Chatbot/Chatbot';
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

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);

  const [maxSquare,setMaxSquare] = useState(200);
  const [minSquare,setMinSquare] = useState(100);

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

  const handleSquareChange = (event) => {
    const val = Number(event.target.value);
    console.log(val)
    if (val == 100) {
      setMaxSquare(200);
      setMinSquare(100);
    }else if (val == 200) {
      setMaxSquare(300);
      setMinSquare(200);
    }else if (val == 300) {
      setMaxSquare(500);
      setMinSquare(300);
    }else if (val == 500) {
      setMaxSquare(1000);
      setMinSquare(500);
    }

  };
  const handlePriceChange = (event) => {
    console.log(properties[0])
    const val = Number(event.target.value);
    console.log(val)
    if (val == 5000) {
      setMaxPrice(5000);
      setMinPrice(0);
    }else if (val == 20000) {
      setMaxPrice(50000);
      setMinPrice(20000);
    }else if (val == 50000) {
      setMaxPrice(100000);
      setMinPrice(50000);
    }

  };
  const extractPriceAmount = (priceString) => {
    const match = priceString.replace(/[^0-9.-]+/g, ''); // Remove all non-numeric characters
    return parseFloat(match);
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
          <div className="filters-container">
            <div className="price-filter">
              <label htmlFor="priceSelect">价格</label>
              <select id="priceSelect" onChange={handlePriceChange}>
                {/* <option value="">总价不限</option> */}
                <option value="5000">0.5万以下</option>
                <option value="20000">2万-5万</option>
                <option value="50000">5万-10万</option>
                {/* <option value="100000">10万以上</option> */}
              </select>
            </div>

            <div className="area-filter">
              <label htmlFor="squareSelect">面积</label>
              <select id="squareSelect" onChange={handleSquareChange}>
                {/* <option value="">总价不限</option> */}
                <option value="100">100-200平</option>
                <option value="200">200-300平</option>
                <option value="300">300-500平</option>
                <option value="500">500-1000平</option>
                {/* <option value="100000">10万以上</option> */}
              </select>
            </div>
          </div>
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
                {properties .filter(property =>
                    (minPrice === 0 || extractPriceAmount(property.price) >= minPrice) &&
                    (maxPrice === Infinity || extractPriceAmount(property.price) <= maxPrice)
                  ).filter(property =>
                    (extractPriceAmount (property.size) <= maxSquare) &&
                    ( extractPriceAmount (property.size) >= minSquare) 
                  ).map(property => (
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

      <Chatbot />
      
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
