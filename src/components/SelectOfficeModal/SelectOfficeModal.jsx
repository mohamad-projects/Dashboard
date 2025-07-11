import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../features/auth/authSlice'; // Assuming this fetches all users/offices
import { DarkModeContext } from '../../context/DarkModeContext';
import { FaBuilding, FaUserCircle, FaTimes, FaSearch } from 'react-icons/fa';
import './SelectOfficeModal.scss'; // You'll create this SCSS file too

const SelectOfficeModal = ({ isOpen, onClose, onSelectOffice }) => {
  const dispatch = useDispatch();
  const { translateMode } = useContext(DarkModeContext);
  const { users, loading, error } = useSelector((state) => state.auth); // Assuming users list is here
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    if (isOpen) { // Only fetch users when the modal is open
      dispatch(getAllUsers());
    }
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  const t = {
    title: translateMode ? "Select Real Estate Office" : "اختر المكتب العقاري",
    searchPlaceholder: translateMode ? "Search by name or ID..." : "البحث بالاسم أو المعرف...",
    loading: translateMode ? "Loading offices..." : "جاري تحميل المكاتب...",
    error: translateMode ? "Failed to load offices." : "فشل تحميل المكاتب.",
    noOffices: translateMode ? "No offices found." : "لم يتم العثور على مكاتب.",
    select: translateMode ? "Select" : "اختيار",
    userId: translateMode ? "User ID:" : "معرف المستخدم:",
    close: translateMode ? "Close" : "إغلاق",
  };

  // Filter users to only show those who are 'office' (adjust role logic as per your backend)
  // And filter by search term
  const filteredOffices = users
    ? users.filter(user =>
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.id?.toString().includes(searchTerm))) // Search by name or ID
    : [];
    console.log(filteredOffices)

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2><FaBuilding className="header-icon" /> {t.title}</h2>
          <button className="close-button" onClick={onClose} aria-label={t.close}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p className="modal-status loading-message">{t.loading}</p>}
        {error && <p className="modal-status error-message">{t.error}</p>}

        {!loading && !error && filteredOffices.length === 0 && (
          <p className="modal-status no-data-message">{t.noOffices}</p>
        )}

        <div className="office-list">
          {!loading && filteredOffices.map((office) => (
            <div key={office.id} className="office-item">
              <FaUserCircle className="office-icon" />
              <div className="office-details">
                <span className="office-name">{office.name}</span>
                <span className="office-id">{t.userId} {office.id}</span>
              </div>
              <button className="select-button" onClick={() => onSelectOffice(office.id)} aria-label={`${t.select} ${office.name}`}>
                {t.select}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectOfficeModal;