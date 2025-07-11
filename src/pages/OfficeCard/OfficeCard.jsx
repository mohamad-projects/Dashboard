import {
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaTelegram,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import './OfficeCard.scss';

const OfficeCard = ({ office, translateMode, onToggleSubscription }) => {
  return (
    <div className={`office-card ${office.subscribed ? 'active' : 'inactive'}`}>
      <div className="office-info">
        <h2>{translateMode ? office.nameEn : office.name}</h2>
        <p><FaMapMarkerAlt /> {translateMode ? office.addressEn : office.address}</p>
        <p><FaPhone /> {office.phone}</p>

        {office.subscribed && (
          <p className="published-count">
            {translateMode ? 'Properties published: ' : 'عدد العقارات المنشورة: '}
            <strong>{office.propertiesCount}</strong>
          </p>
        )}
      </div>

      <div className="action-buttons">
        <button className="subscription-btn" onClick={onToggleSubscription}>
          {office.subscribed ? (
            <>
              <FaCheckCircle /> {translateMode ? 'Subscribed' : 'مشترك'}
            </>
          ) : (
            <>
              <FaTimesCircle /> {translateMode ? 'Not Subscribed' : 'غير مشترك'}
            </>
          )}
        </button>

        <a
          href={`https://wa.me/${office.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp"
        >
          <FaWhatsapp /> WhatsApp
        </a>

        <a
          href={`https://t.me/${office.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="telegram"
        >
          <FaTelegram /> Telegram
        </a>
      </div>
    </div>
  );
};

export default OfficeCard;
