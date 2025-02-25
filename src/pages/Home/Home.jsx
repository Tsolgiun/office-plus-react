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
  const [maxPrice, setMaxPrice] = useState(Infinity);

  const [minSquare, setMinSquare] = useState(0);
  const [maxSquare, setMaxSquare] = useState(Infinity);

  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');

  const [customMinSquare, setCustomMinSquare] = useState('');
  const [customMaxSquare, setCustomMaxSquare] = useState('');
  
  const [customType, setCustomType] = useState('');

  const [CustomCity, setCustomCity] = useState('');

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

  const handleCustomMinPriceChange = (event) => {
    let value = event.target.value;
    if (value < 0) {
      value = 0;
    }
    if (value > 9999) {
      value = 9999;
    }
    setCustomMinPrice(value);
  };

  const handleCustomMaxPriceChange = (event) => {
    let value = event.target.value;
    if (value < 0) {
      value = 0;
    }
    if (value > 9999) {
      value = 9999;
    }
    setCustomMaxPrice(value);
  };

  const handleCustomMinSquareChange = (event) => {
    let value = event.target.value;
    if (value < 0) {
      value = 0;
    }
    if (value > 9999) {
      value = 9999;
    }
    setCustomMinSquare(value);
  };

  const handleCustomMaxSquareChange = (event) => {
    let value = event.target.value;
    if (value < 0) {
      value = 0;
    }
    if (value > 9999) {
      value = 9999;
    }
    setCustomMaxSquare(value);
  };

  const handleApplyPriceFilter = () => {
    setMinPrice(customMinPrice ? Number(customMinPrice) : 0);
    setMaxPrice(customMaxPrice ? Number(customMaxPrice) : Infinity);
  };

  const handleApplySquareFilter = () => {
    setMinSquare(customMinSquare ? Number(customMinSquare) : 0);
    setMaxSquare(customMaxSquare ? Number(customMaxSquare) : Infinity);
  };

  const handleSquareChange = (event) => {
    if (event.target.value == "") {
      setMaxSquare(Infinity);
      setMinSquare(0);
      return
    }
    const val = Number(event.target.value);
    if (val == 100) {
      setMaxSquare(200);
      setMinSquare(100);
    } else if (val == 200) {
      setMaxSquare(300);
      setMinSquare(200);
    } else if (val == 300) {
      setMaxSquare(500);
      setMinSquare(300);
    } else if (val == 500) {
      setMaxSquare(1000);
      setMinSquare(500);
    }

  };
  const handlePriceChange = (event) => {
    console.log(properties[0])
    if (event.target.value == "") {
      setMaxPrice(Infinity);
      setMinPrice(0);
      return
    }
    const val = Number(event.target.value);
    if (val == 5000) {
      setMaxPrice(5000);
      setMinPrice(0);
    } else if (val == 20000) {
      setMaxPrice(50000);
      setMinPrice(20000);
    } else if (val == 50000) {
      setMaxPrice(100000);
      setMinPrice(50000);
    }

  };
  const handleTypeChange = (event) => {
    console.log(event.target.value)
    setCustomType(event.target.value);
  }

  const handleCityChange = (event) => {
    setCustomCity(event.target.value);
  }
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
                <option value="">总价不限</option>
                <option value="5000">0.5万以下</option>
                <option value="20000">2万-5万</option>
                <option value="50000">5万-10万</option>
                {/* <option value="100000">10万以上</option> */}
              </select>
              <span className="rang-custom">
                <input
                  type="number"
                  data-field-clear="indexarea"
                  data-field="priceFrom"
                  value={customMinPrice}
                  min="0"
                  max="9999"
                  maxLength={4}
                  onChange={handleCustomMinPriceChange}
                  className="input-int input-custom text-custom text-custom-min"
                />
                <em>-</em>
                <input
                  type="number"
                  data-field-clear="indexarea"
                  data-field="priceTo"
                  value={customMaxPrice}
                  min="0"
                  max="9999"
                  onChange={handleCustomMaxPriceChange}
                  className="input-int input-custom text-custom text-custom-max"
                />
              </span>
              <span className="unit-label">$</span>
              <button className="apply-filter-button" onClick={handleApplyPriceFilter}>应用价格过滤</button>
            </div>

            <div className="area-filter">
              <label htmlFor="squareSelect">面积</label>
              <select id="squareSelect" onChange={handleSquareChange}>
                <option value="">总面积不限</option>
                <option value="100">100-200平</option>
                <option value="200">200-300平</option>
                <option value="300">300-500平</option>
                <option value="500">500-1000平</option>
                {/* <option value="100000">10万以上</option> */}
              </select>
              <span className="rang-custom">
                <input
                  type="number"
                  data-field-clear="indexarea"
                  data-field="sqaureFrom"
                  value={customMinSquare}
                  min="0"
                  max="9999"
                  onChange={handleCustomMinSquareChange}
                />
                <em>-</em>
                <input
                  type="number"
                  data-field-clear="indexarea"
                  data-field="squareTo"
                  value={customMaxSquare}
                  min="0"
                  max="9999"
                  onChange={handleCustomMaxSquareChange}
                />
              </span>
              <span className="unit-label">m²</span>
              <button className="apply-filter-button" onClick={handleApplySquareFilter}>应用面积过滤</button>
            </div>
          

          <div className="area-filter">
              <label htmlFor="squareSelect">类型</label>
              <select id="squareSelect" onChange={handleTypeChange}>
                <option value="">类型不限</option>
                <option value="Business Center">Business Center</option>
                <option value="Corporate Suite">Corporate Suite</option>
                <option value="Creative Loft">Creative Loft</option>
                <option value="Creative Space">Creative Space</option>
                <option value="Co-working Space">Co-working Space</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Garden Office">Garden Office</option>
                <option value="Heritage Space">Heritage Space</option>
                <option value="Innovation Space">Innovation Space</option>
                <option value="Learning Space">Learning Space</option>
                <option value="Luxury Office">Luxury Office</option>
                <option value="Premium Office">Premium Office</option>
                <option value="Penthouse Office">Penthouse Office</option>
                <option value="Private Office">Private Office</option>
                <option value="Smart Office">Smart Office</option>
                <option value="Small Office">Small Office</option>
                <option value="Sustainable Office">Sustainable Office</option>
                <option value="Wellness Space">Wellness Space</option>   
              </select>
            </div>

            <div className="area-filter">
              <label htmlFor="squareSelect">城市</label>
              <select id="squareSelect" onChange={handleCityChange}>
              <option value="">不限</option>
                <option value="Shanghai">Shanghai</option>
                <option value="Beijing">Beijing</option>
                <option value="Guangzhou">Guangzhou</option>
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
                {properties.filter(property =>
                  (minPrice === 0 || extractPriceAmount(property.price) >= minPrice) &&
                  (maxPrice === Infinity || extractPriceAmount(property.price) <= maxPrice)
                ).filter(property =>
                  (minSquare === 0 || extractPriceAmount(property.size) <= maxSquare) &&
                  (maxSquare === Infinity || extractPriceAmount(property.size) >= minSquare)
                ).filter(property =>
                  (customType === '' || property.type === customType)
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
