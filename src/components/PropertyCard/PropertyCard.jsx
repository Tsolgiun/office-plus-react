import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faRulerCombined, 
  faUsers, 
  faBuilding, 
  faCheck 
} from '@fortawesome/free-solid-svg-icons';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const { 
    title, 
    price, 
    location, 
    image, 
    size, 
    capacity, 
    type, 
    amenities, 
    availability 
  } = property;

  return (
    <div className="property-card">
      <div 
        className="property-image" 
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className={`property-availability ${availability.toLowerCase().includes('immediate') ? 'immediate' : ''}`}>
          {availability}
        </div>
      </div>
      <div className="property-info">
        <h3>{title}</h3>
        <div className="property-price">{price}</div>
        <div className="property-location">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {location}
        </div>
        <div className="property-features">
          <span>
            <FontAwesomeIcon icon={faRulerCombined} /> {size}
          </span>
          <span>
            <FontAwesomeIcon icon={faUsers} /> Up to {capacity} people
          </span>
          <span>
            <FontAwesomeIcon icon={faBuilding} /> {type}
          </span>
        </div>
        <div className="property-amenities">
          <h4>Amenities</h4>
          <div className="amenities-grid">
            {amenities.map((amenity, index) => (
              <span key={index}>
                <FontAwesomeIcon icon={faCheck} /> {amenity}
              </span>
            ))}
          </div>
        </div>
        <button 
          className="view-details-btn"
          onClick={() => window.location.href = `/office/${property.id}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
