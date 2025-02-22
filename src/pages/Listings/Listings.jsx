import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { propertyService } from '../../services/property';
import './Listings.css';

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      console.log('Fetching properties from API...');
      const data = await propertyService.getAllProperties();
      console.log('Received properties:', data);

      // Validate property data
      const validProperties = data.filter(property => {
        const isValid = property.title && 
                       property.building && 
                       property.building.name && 
                       property.amenities;
        
        if (!isValid) {
          console.warn('Invalid property data:', property);
        }
        return isValid;
      });

      console.log('Valid properties count:', validProperties.length);
      setProperties(validProperties);
      setFilteredProperties(validProperties);
      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to load properties. Please try again later.';
      console.error('Error loading properties:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProperties(properties);
      return;
    }

    console.log('Searching with term:', searchTerm);
    const searchLower = searchTerm.toLowerCase();
    const filtered = properties.filter(property => {
      try {
        return (
          property.location.toLowerCase().includes(searchLower) ||
          property.title.toLowerCase().includes(searchLower) ||
          property.type.toLowerCase().includes(searchLower) ||
          (property.building?.name || '').toLowerCase().includes(searchLower) ||
          property.amenities.some(amenity => 
            amenity.toLowerCase().includes(searchLower)
          )
        );
      } catch (err) {
        console.warn('Error filtering property:', property, err);
        return false;
      }
    });

    console.log('Filtered properties count:', filtered.length);
    setFilteredProperties(filtered);
  };

  return (
    <div className="listings-page">
      <Header onSearch={handleSearch} />
      
      <main className="listings-content">
        <section className="listings-section">
          <h2>Available Office Spaces</h2>
          {loading ? (
            <div className="loading">Loading properties...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="property-grid">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <p className="no-results">No office spaces found matching your search.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Listings;
