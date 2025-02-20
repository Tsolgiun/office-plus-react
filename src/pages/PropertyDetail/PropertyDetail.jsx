import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/api';
import './PropertyDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faRulerCombined, 
  faUsers, 
  faBuilding,
  faParking,
  faShieldAlt,
  faCheck,
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
        document.title = `${data.title} | Office Details`;
      } catch (err) {
        setError(err.message || 'Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="property-detail-container" aria-live="polite">
        <div className="loading-spinner" role="status">
          Loading property details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-container" role="alert">
        <div className="error-message">
          {error}
          <button onClick={() => navigate('/offices')} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Listings
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail-container" role="alert">
        <div className="error-message">
          Property not found
          <button onClick={() => navigate('/offices')} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-container">
      <button onClick={() => navigate('/offices')} className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Listings
      </button>
      
      <div className="property-detail-header">
        <h1>{property.title}</h1>
        <div className="property-price">{property.price}</div>
      </div>

      <div className="property-detail-image">
        <img 
          src={property.image || 'https://via.placeholder.com/800x400?text=No+Image+Available'} 
          alt={property.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
          }}
        />
      </div>

      <div className="property-detail-info">
        <div className="info-section">
          <h2>Location</h2>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.location}
          </p>
        </div>

        <div className="info-section specifications">
          <h2>Specifications</h2>
          <div className="specs-grid">
            <div>
              <FontAwesomeIcon icon={faRulerCombined} /> {property.size}
            </div>
            <div>
              <FontAwesomeIcon icon={faUsers} /> Up to {property.capacity} people
            </div>
            <div>
              <FontAwesomeIcon icon={faBuilding} /> {property.type}
            </div>
          </div>
        </div>

        {property.building && (
          <div className="info-section">
            <h2>Building Information</h2>
            <h3>{property.building.name}</h3>
            <div className="building-features">
              {property.building.parkingAvailable && (
                <div className="feature">
                  <FontAwesomeIcon icon={faParking} /> Parking Available
                </div>
              )}
              {property.building.security?.type === '24/7' && (
                <div className="feature">
                  <FontAwesomeIcon icon={faShieldAlt} /> 24/7 Security
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-section">
          <h2>Amenities</h2>
          <div className="amenities-grid">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="amenity">
                <FontAwesomeIcon icon={faCheck} /> {amenity}
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h2>Availability</h2>
          <p className={`availability ${property.availability.toLowerCase().includes('immediate') ? 'immediate' : ''}`}>
            {property.availability}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
