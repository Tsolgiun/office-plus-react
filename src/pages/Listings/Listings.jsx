import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { properties } from '../../data/properties';
import './Listings.css';

const Listings = () => {
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const handleSearch = (searchTerm) => {
    const filtered = properties.filter(property => 
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.amenities.some(amenity => 
        amenity.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProperties(filtered);
  };

  return (
    <div className="listings-page">
      <Header onSearch={handleSearch} />
      
      <main className="listings-content">
        <section className="listings-section">
          <h2>Available Office Spaces</h2>
          <div className="property-grid">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <p className="no-results">No office spaces found matching your search.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Listings;
