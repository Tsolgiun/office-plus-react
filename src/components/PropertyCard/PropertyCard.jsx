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
    availability,
    _id 
  } = property;

  const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80';

  return (
    <a href={`/office/${_id}`} className="property-card">
      <div 
        className="property-image" 
        style={{ 
          backgroundImage: `url('${image || fallbackImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
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
      </div>
    </a>
  );
};

export default PropertyCard;
