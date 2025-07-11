import React, { useContext } from 'react';
import {
  FaChartBar, FaBuilding, FaHome, FaWrench, FaUsers, FaSignOutAlt, FaSearch, FaLanguage, FaRegCheckCircle, FaComments, FaMapMarkerAlt, FaTimes // FaTimes for close button
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import { DarkModeContext } from '../../context/DarkModeContext';

// Added isOpen and onClose props to control sidebar visibility
const Sidebar = ({ isOpen, onClose }) => { 
  const { translateMode, toggleLanguage } = useContext(DarkModeContext);
  const location = useLocation();

  const menuItems = [
    { icon: <FaChartBar />, label: translateMode ? 'Dashboard' : 'لوحة التحكم', path: '/dashboard' },
    { icon: <FaBuilding />, label: translateMode ? 'Offices' : 'المكاتب', path: '/officemanagement' }, 
    { icon: <FaHome />, label: translateMode ? 'Properties for sale' : 'عقارات للبيع', path: '/display' },
    { icon: <FaHome />, label: translateMode ? 'Properties for rent' : 'عقارات للإيجار', path: '/displayrent' },
    { icon: <FaWrench />, label: translateMode ? 'Services' : 'الخدمات', path: '/servicesmanagement' }, 
    { icon: <FaRegCheckCircle />, label: translateMode ? 'Verifications' : 'التوثيقات', path: '/verifications' }, 
    { icon: <FaComments />, label: translateMode ? 'Complaints' : 'الشكاوى', path: '/complaints' }, 
    { icon: <FaMapMarkerAlt />, label: translateMode ? 'Locations' : 'المناطق', path: '/locationmanagement' }, 
    { icon: <FaUsers />, label: translateMode ? 'Users' : 'المستخدمين', path: '/users' },
    { icon: <FaSignOutAlt />, label: translateMode ? 'Logout' : 'تسجيل الخروج', path: '/logout' },
    { icon: <FaSignOutAlt />, label: translateMode ? 'Make Admin' : 'أاضافة ادمن', path: '/MakeAdmin' },
  ];

  return (
    // Add 'open' class based on isOpen prop for animation
    <aside className={`sidebar ${translateMode ? 'en' : 'ar'} ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header"> {/* New header for mobile sidebar to hold brand and close button */}
        <div className="side-brand">
          <span className="brand-text">
            
            H<FaSearch className="search-icon" />omeFinder
          </span>
        </div>
       
      </div>

      <button
        type="button" 
        className="sidebar-link toggle-lang"
        onClick={toggleLanguage}
        aria-label={translateMode ? 'Switch to Arabic' : 'Switch to English'} 
      >
        <span className="icon"><FaLanguage /></span>
        <span className="label">
          {translateMode ? 'العربية' : 'English'}
        </span>
      </button>

      <ul className="sidebar-menu">
        {menuItems.map((item) => ( 
          <li key={item.path}> 
            <Link
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`} 
              aria-current={location.pathname === item.path ? 'page' : undefined} 
              onClick={onClose}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;