// src/pages/Profile/Profile.jsx
import React, { useEffect, useState, useContext } from 'react';
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../../features/auth/authSlice';
import { deleteRealEstate } from '../../features/realEstate/realEstateSlice';
import { deleteServiceById } from '../../features/auth/authService';
import Display from '../Display/Display';
import { DarkModeContext } from '../../context/DarkModeContext';
import { FaWhatsapp, FaTelegram, FaTrash } from 'react-icons/fa';
import Sidebar from '../../components/SideBar/SideBar';

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { translateMode } = useContext(DarkModeContext);

  const user = useSelector((state) => state.auth.user);
  const profileData = useSelector((state) => state.auth.profile);

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('real_estate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [serviceToEdit, setServiceToEdit] = useState(null);

  useEffect(() => {
    dispatch(profile(id));
  }, [dispatch, id]);

  const properties = profileData?.realEstate || [];
  const services = profileData?.service || [];
  const lastPage = profileData?.meta?.realEstate?.last_page || 1;

  const handleDelete = (itemId, type) => {
    if (type === 'real_estate') {
      dispatch(deleteRealEstate(itemId)).then(() => dispatch(profile(id)));
    } else if (type === 'service') {
      dispatch(deleteServiceById(itemId)).then(() => dispatch(profile(id)));
    }
  };

  const handleEditService = (service) => {
    setServiceToEdit(service);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      dispatch(profile(id));
    }
  };

  const handleServiceAdded = () => {
    dispatch(profile(id));
  };

  const showActions = user?.id === profileData?.user?.id;
  const phoneNumber = profileData?.contact?.phone || '';
  const telegramUsername = profileData?.contact?.telegram || '';

  return (
    <div className="profile-page-wrapper">
      <Sidebar />
      <div className="app-container profile-container">
        <div className="profile-header">
          <h1>{profileData?.user?.name}'s Profile</h1>
          <div className="user-meta">
            <span className={`status-badge ${profileData?.user?.status?.toLowerCase()}`}>
              {profileData?.user?.status}
            </span>
            <span>
              {translateMode ? `Joined: ${profileData?.user?.join_date}` : `انضم: ${profileData?.user?.join_date}`}
            </span>
          </div>
        </div>

        <div className="contact-section">
          <h2>{translateMode ? 'Contact Information' : 'معلومات الاتصال'}</h2>
          <div className="contact-details">
            <p><strong>{translateMode ? 'Address:' : 'العنوان:'}</strong> {profileData?.address?.full_address || (translateMode ? 'Not provided' : 'غير متوفر')}</p>
            <p><strong>{translateMode ? 'Phone:' : 'الهاتف:'}</strong> {phoneNumber || (translateMode ? 'Not provided' : 'غير متوفر')}</p>
            <p><strong>{translateMode ? 'Email:' : 'البريد الإلكتروني:'}</strong> {profileData?.user?.email}</p>
          </div>

          <div className="contact-buttons">
            {phoneNumber && (
              <a href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn">
                <FaWhatsapp /> {translateMode ? 'WhatsApp' : 'واتساب'}
              </a>
            )}
            {telegramUsername && (
              <a href={`https://t.me/${telegramUsername}`} target="_blank" rel="noopener noreferrer" className="contact-btn telegram-btn">
                <FaTelegram /> {translateMode ? 'Telegram' : 'تيليجرام'}
              </a>
            )}
          </div>
        </div>

        <div className="listings-section">
          <div className="tabs">
            <button className={`tab-button ${activeTab === 'real_estate' ? 'active' : ''}`} onClick={() => setActiveTab('real_estate')}>
              {translateMode ? 'Real Estate' : 'العقارات'}
            </button>
            
          </div>

          <div className="listings-content">
            {activeTab === 'real_estate' ? (
              properties.length > 0 ? (
                <Display
                  properties={properties}
                  translateMode={translateMode}
                  isProfile={true}
                  currentUserId={user?.id}
                  profileUserId={profileData?.user?.id}
                  onDelete={(id) => handleDelete(id, 'real_estate')}
                  onEdit={(id) => console.log('Edit property', id)}
                  currentPage={currentPage}
                  lastPage={lastPage}
                  handlePageChange={handlePageChange}
                  showActions={showActions}
                />
              ) : (
                <p className="no-data">{translateMode ? 'No real estate listings available.' : 'لا توجد قوائم عقارية.'}</p>
              )
            ) : (
              services.length > 0 ? (
                <div className="services-list">
                  {services.map((service) => (
                    <div key={service.id} className="service-item">
                      <div className="item-header">
                        <h3>{translateMode ? `Service #${service.id}` : `خدمة #${service.id}`}</h3>
                        <div className="item-actions">
                          <button
                            className="action-icon delete"
                            onClick={() => handleDelete(service.id, 'service')}
                            title={translateMode ? 'Delete service' : 'حذف الخدمة'}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p><strong>{translateMode ? 'Title:' : 'العنوان:'}</strong> {service.title}</p>
                      <p><strong>{translateMode ? 'Description:' : 'الوصف:'}</strong> {service.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">{translateMode ? 'No services available.' : 'لا توجد خدمات.'}</p>
              )
            )}
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Profile;
