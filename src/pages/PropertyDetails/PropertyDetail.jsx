import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../../context/DarkModeContext';
import {
  FaBed, FaBath, FaRulerCombined, FaArrowLeft, FaArrowRight,
  FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './PropertyDetails.scss';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import houseImage from '../../assets/soc.jpg'; // Default placeholder image
import { useDispatch, useSelector } from 'react-redux';
import { getRealEstateDetails } from '../../features/auth/authSlice';

// Leaflet settings for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const PropertyDetails = () => {
  const { id } = useParams();
  const { translateMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();
  const { realEstateDetails: property, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getRealEstateDetails(id));
    }
  }, [dispatch, id]);

  // Handle loading, error, and no property data
  if (loading) {
    return (
      <div className="property-details-page loading-state">
        <div className="status-message loading-message">
          {translateMode ? "Loading property details..." : "جاري تحميل تفاصيل العقار..."}
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-details-page error-state">
        <div className="status-message error-message">
          {translateMode ? 'Property not found or an error occurred.' : 'العقار غير موجود أو حدث خطأ.'}
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (property.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  // Safely access contact info
  const contact = property.user?.contact?.[0] || {};
  const phoneNumber = contact.phone_no || '';
  const telegramUsername = contact.username || '';

  // Amenities data based on properties
  const amenities = [];
  if (property.properties?.electricity_status === "1") amenities.push(translateMode ? "Electricity" : "كهرباء");
  if (property.properties?.water_status === "1") amenities.push(translateMode ? "Water" : "مياه");
  if (property.properties?.transportation_status === "1") amenities.push(translateMode ? "Transportation" : "مواصلات");
  if (property.properties?.water_well === "1") amenities.push(translateMode ? "Water well" : "بئر ماء");
  if (property.properties?.solar_energy === "1") amenities.push(translateMode ? "Solar energy" : "طاقة شمسية");
  if (property.properties?.garage === "1") amenities.push(translateMode ? "Garage" : "كراج");
  if (property.properties?.elevator === "1") amenities.push(translateMode ? "Elevator" : "مصعد");
  if (property.properties?.garden_status === "1") amenities.push(translateMode ? "Garden" : "حديقة");

  return (
    <div className={`property-details-page ${translateMode ? 'ltr' : 'rtl'}`}>
      <button className="back-button" onClick={() => navigate(-1)} aria-label={translateMode ? 'Back to Listings' : 'العودة إلى القائمة'}>
        <FaArrowLeft /> {translateMode ? 'Back to Listings' : 'العودة إلى القائمة'}
      </button>

      <div className="property-content">
        <div className="left-section">
          <div className="image-gallery">
            <div className="main-image-container">
              <img
                src={
                  property.images?.length > 0
                    ? `http://localhost:8000/storage/real-estate/${property.images[currentImageIndex]?.name}`
                    : houseImage
                }
                alt={property.title || 'Property image'} // Add alt text for accessibility
                className="main-image" // Added class for image styling
              />
              {property.images?.length > 1 && (
                <>
                  <div className="image-counter">
                    {currentImageIndex + 1}/{property.images.length}
                  </div>
                  <button className="nav-button prev" onClick={prevImage} aria-label={translateMode ? 'Previous image' : 'الصورة السابقة'}>
                    <FaArrowLeft />
                  </button>
                  <button className="nav-button next" onClick={nextImage} aria-label={translateMode ? 'Next image' : 'الصورة التالية'}>
                    <FaArrowRight />
                  </button>
                </>
              )}
            </div>

            {property.images?.length > 1 && (
              <div className="thumbnails">
                {property.images.map((img, index) => (
                  <div
                    key={img.name || index} // Use img.name as key if unique, fallback to index
                    className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={translateMode ? `View image ${index + 1}` : `عرض الصورة ${index + 1}`}
                    role="button" // Indicate clickable element
                    tabIndex="0" // Make it focusable
                  >
                    <img
                      src={`http://localhost:8000/storage/real-estate/${img.name}`}
                      alt={`Thumbnail ${index + 1} for property`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="details-grid-container card-section">
            <div className="detail-item">
              <FaBed className="icon" />
              <div>
                <span className="label">{translateMode ? 'Bedrooms' : 'غرف نوم'}</span>
                <span className="value">{property.properties?.room_no || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-item">
              <FaBath className="icon" />
              <div>
                <span className="label">{translateMode ? 'Bathrooms' : 'حمامات'}</span>
                <span className="value">{property.properties?.bathroom_no || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-item">
              <FaRulerCombined className="icon" />
              <div>
                <span className="label">{translateMode ? 'Area' : 'المساحة'}</span>
                <span className="value">{property.properties?.space_status || 'N/A'} m²</span>
              </div>
            </div>

            <div className="detail-item">
              <FaRulerCombined className="icon" />
              <div>
                <span className="label">{translateMode ? 'Floor' : 'الطابق'}</span>
                <span className="value">{property.properties?.floor || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-item">
              <FaRulerCombined className="icon" />
              <div>
                <span className="label">{translateMode ? 'Direction' : 'عدد الاتجاهات'}</span>
                <span className="value">{property.properties?.direction || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-item">
              <FaRulerCombined className="icon" />
              <div>
                <span className="label">{translateMode ? 'Ownership Type' : 'نوع الملكية'}</span>
                <span className="value">
                  {property.properties?.ownership_type === "green" ? (translateMode ? "Green" : "أخضر") :
                    property.properties?.ownership_type === "red" ? (translateMode ? "Red" : "أحمر") :
                      'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="location-section card-section">
            <h2>
              <FaMapMarkerAlt className="section-icon" />
              {translateMode ? 'Location' : 'الموقع'}
            </h2>
            <p>
              {property.location?.city || (translateMode ? 'City N/A' : 'مدينة غير متوفرة')} - {property.location?.district || (translateMode ? 'District N/A' : 'منطقة غير متوفرة')}
            </p>
          </div>

          <div className="description-section card-section">
            <h2>{translateMode ? 'Description' : 'الوصف'}</h2>
            <p>{property.description || (translateMode ? 'No description available for this property.' : 'لا يوجد وصف متاح لهذا العقار.')}</p>
          </div>
        </div>

        <div className="right-section">
          <div className="price-info-card card-section">
            <h1 className="main-title">{property.title || (translateMode ? 'Property Listing' : 'إعلان عقار')}</h1>
            <div className="price-section">
              <span className="price">
                {property.price?.toLocaleString() || '0'} $
              </span>
              <span className="price-label">{translateMode ? 'Asking Price' : 'السعر المطلوب'}</span>
            </div>
            <div className="property-type-badge">
              {property.type === 'sale' ? (translateMode ? 'For Sale' : 'للبيع') : (translateMode ? 'For Rent' : 'للإيجار')}
            </div>
          </div>

          <div className="agency-info-box card-section">
            <div className="agency-icon-wrapper"><FaMapMarkerAlt /></div>
            <div className="agency-details">
              <h3>{translateMode ? 'Real Estate Office' : 'المكتب العقاري'}</h3>
              <p className="agency-name"><strong>{property.user?.name || (translateMode ? 'Not provided' : 'غير متوفر')}</strong></p>
              <p className="agency-phone"><FaPhone /> {phoneNumber || (translateMode ? 'Not provided' : 'غير متوفر')}</p>
            </div>
          </div>

          {amenities.length > 0 && (
            <div className="amenities-section card-section">
              <h2>{translateMode ? 'Amenities' : 'المرافق'}</h2>
              <div className="amenities-grid">
                {amenities.map((item, idx) => (
                  <div key={idx} className="amenity-item">{item}</div>
                ))}
              </div>
            </div>
          )}

          {property.latitude && property.longitude && (
            <div className="map-section card-section">
              <h2>
                <FaMapMarkerAlt className="section-icon" />
                {translateMode ? 'Map Location' : 'الموقع على الخريطة'}
              </h2>
              <MapContainer
                center={[property.latitude, property.longitude]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '350px', width: '100%', borderRadius: '10px', border: `1px solid ${L.Browser.mobile ? 'transparent' : '#e0e0e0'}` }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[property.latitude, property.longitude]}>
                  <Popup>
                    {property.location?.city || 'N/A'} - {property.location?.district || 'N/A'}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <div className="contact-seller-section card-section">
            <h2>{translateMode ? 'Contact Seller' : 'اتصل بالبائع'}</h2>
            <div className="contact-links">
              {phoneNumber && (
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-button whatsapp-link"
                  aria-label={translateMode ? `Contact via WhatsApp: ${phoneNumber}` : `اتصل عبر واتساب: ${phoneNumber}`}
                >
                  <FaWhatsapp className="contact-icon" />
                  {translateMode ? 'WhatsApp' : 'واتساب'}
                </a>
              )}

              {telegramUsername && (
                <a
                  href={`https://t.me/${telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-button telegram-link"
                  aria-label={translateMode ? `Contact via Telegram: ${telegramUsername}` : `اتصل عبر تيليغرام: ${telegramUsername}`}
                >
                  <FaTelegram className="contact-icon" />
                  {translateMode ? 'Telegram' : 'تيليغرام'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;