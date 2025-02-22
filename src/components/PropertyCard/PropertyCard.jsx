import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faRulerCombined, 
  faUsers, 
  faBuilding,
  faParking,
  faShieldAlt,
  faCheck 
} from '@fortawesome/free-solid-svg-icons';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  if (!property) {
    return <div className="property-card-error" role="alert">Invalid property data</div>;
  }

  const { 
    id = '',
    title = 'Untitled Property', 
    price = 'Price on request', 
    location = 'Location not specified', 
    image = '', 
    size = 'Size not specified', 
    capacity = 0, 
    type = 'Office Space', 
    amenities = [], 
    availability = 'Contact for availability',
    building = {}
  } = property;

  const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="property-card">
      <a 
        href={`/office/${id}`} 
        className="property-card-link"
        aria-label={`View details of ${title} - ${price}`}
        onClick={(e) => {
          if (!id) {
            e.preventDefault();
          }
        }}
      >
        <div className="property-image">
          <img 
            src={image || fallbackImage}
            alt={title}
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.alt = 'Property image not available';
            }}
          />
          <div 
            className={`property-availability ${availability.toLowerCase().includes('immediate') ? 'immediate' : ''}`}
            role="status"
          >
            {availability}
          </div>
        </div>
        <div className="property-info">
          <h2 className="property-title">{title}</h2>
          <div className="property-price">{price}</div>
          <div className="property-location" aria-label="Location">
            <FontAwesomeIcon icon={faMapMarkerAlt} aria-hidden="true" /> {location}
          </div>
          <div className="property-features" role="list">
            <div role="listitem">
              <FontAwesomeIcon icon={faRulerCombined} aria-hidden="true" /> {size.replace('sq.ft', 'm²')}
            </div>
            <div role="listitem">
              <FontAwesomeIcon icon={faUsers} aria-hidden="true" /> Up to {capacity} people
            </div>
            <div role="listitem">
              <FontAwesomeIcon icon={faBuilding} aria-hidden="true" /> {type}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default PropertyCard;
