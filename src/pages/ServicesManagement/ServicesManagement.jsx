import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllServiceTypes,
  getServiceInfoById,
  setSelectedServiceId,
  deleteServiceById,
  createServiceType, // Keep createServiceType
  deleteMainServiceType,
} from '../../features/auth/authService'; // Assuming authService handles these
import AddServiceModal from '../../components/AddServiceModal/AddServiceModal';
import { DarkModeContext } from '../../context/DarkModeContext';
import Sidebar from '../../components/SideBar/SideBar';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaPlusCircle, FaTimesCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Import necessary icons

import './ServicesManagement.scss';

const ServicesManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translateMode } = useContext(DarkModeContext);

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    selectedServiceId,
    selectedServiceInfo,
    loading: serviceInfoLoading,
    error: serviceInfoError,
  } = useSelector((state) => state.services); // Changed from auth to services, assuming 'services' is the correct slice name as per your usage

  const [isAddSubServiceModalOpen, setAddSubServiceModalOpen] = useState(false);
  const [isAddMainServiceModalOpen, setAddMainServiceModalOpen] = useState(false);
  const [newMainServiceTypeName, setNewMainServiceTypeName] = useState('');

  // State for operation feedback
  const [operationSuccess, setOperationSuccess] = useState(null);
  const [operationError, setOperationError] = useState(null);

  // Translation object
  const t = {
    pageTitle: translateMode ? 'Manage Services' : 'إدارة الخدمات',
    addMainServiceButton: translateMode ? 'Add Main Service' : 'إضافة خدمة رئيسية',
    mainServiceTypesTitle: translateMode ? 'Main Service Types' : 'أنواع الخدمات الرئيسية',
    loadingMainServices: translateMode ? 'Loading main services...' : 'جاري تحميل الخدمات الرئيسية...',
    errorLoadingMainServices: translateMode ? 'Error loading main services.' : 'خطأ في تحميل الخدمات الرئيسية.',
    noMainServiceTypesFound: translateMode ? 'No main service types found.' : 'لم يتم العثور على أنواع خدمات رئيسية.',
    selectService: translateMode ? 'Select service' : 'اختر خدمة',
    deleteMainServiceTitle: translateMode ? 'Delete Main Service' : 'حذف الخدمة الرئيسية',
    confirmDeleteMainService: translateMode ? 'Delete this main service type and all its associated sub-services? This action cannot be undone.' : 'هل تريد حذف نوع الخدمة الرئيسي وجميع الأصناف المرتبطة به؟ لا يمكن التراجع عن هذا الإجراء.',
    mainServiceDeletedSuccess: translateMode ? 'Main service type and contents deleted successfully!' : 'تم حذف نوع الخدمة الرئيسي ومحتوياته بنجاح!',
    mainServiceDeleteFailed: translateMode ? 'Failed to delete main service type.' : 'فشل حذف نوع الخدمة الرئيسي.',
    subServicesTitle: translateMode ? 'Sub-Services & Categories' : 'الخدمات الفرعية والأصناف',
    loadingSubServices: translateMode ? 'Loading sub-services...' : 'جاري تحميل الأصناف...',
    errorLoadingSubServices: translateMode ? 'Error loading sub-services.' : 'خطأ في تحميل الأصناف.',
    noSubServicesFound: translateMode ? 'No sub-services found for this type.' : 'لم يتم العثور على أصناف لهذه الخدمة.',
    publishedBy: translateMode ? 'Published by:' : 'تم النشر بواسطة:',
    unknown: translateMode ? 'Unknown' : 'غير معروف',
    viewProfile: translateMode ? 'View profile of' : 'عرض ملف تعريف',
    userIdNotAvailable: translateMode ? 'User ID not available for this service.' : 'معرف المستخدم غير متاح لهذه الخدمة.',
    deleteSubServiceTitle: translateMode ? 'Delete Sub-Service' : 'حذف الصنف',
    confirmDeleteSubService: translateMode ? 'Are you sure you want to delete this sub-service?' : 'هل أنت متأكد من حذف هذا الصنف؟',
    subServiceDeletedSuccess: translateMode ? 'Sub-service deleted successfully!' : 'تم حذف الصنف بنجاح!',
    subServiceDeleteFailed: translateMode ? 'Failed to delete sub-service.' : 'فشل حذف الصنف.',
    addMainServiceModalTitle: translateMode ? 'Add New Main Service' : 'إضافة خدمة رئيسية جديدة',
    enterServiceNamePlaceholder: translateMode ? 'Enter service name' : 'أدخل اسم الخدمة',
    serviceNameEmptyError: translateMode ? 'Service name cannot be empty.' : 'لا يمكن أن يكون اسم الخدمة فارغًا.',
    add: translateMode ? 'Add' : 'إضافة',
    cancel: translateMode ? 'Cancel' : 'إلغاء',
    mainServiceAddedSuccess: translateMode ? 'Main service added successfully!' : 'تمت إضافة خدمة رئيسية بنجاح!',
    mainServiceAddFailed: translateMode ? 'Failed to add main service.' : 'فشل إضافة خدمة رئيسية.',
    addSubServiceButton: translateMode ? 'Add Sub Service' : 'إضافة صنف', // Added for the new button
  };


  useEffect(() => {
    dispatch(getAllServiceTypes());
  }, [dispatch]);

  const handleSelectService = (id) => {
    setOperationSuccess(null);
    setOperationError(null);
    dispatch(setSelectedServiceId(id));
    dispatch(getServiceInfoById(id));
  };

  const handleDeleteSubService = async (id) => {
    setOperationSuccess(null);
    setOperationError(null);

    if (window.confirm(t.confirmDeleteSubService)) {
      try {
        await dispatch(deleteServiceById(id)).unwrap();
        setOperationSuccess(t.subServiceDeletedSuccess);
        // Refresh selected service info if it was deleted from the current view
        if (selectedServiceId) { // Ensure selectedServiceId exists before fetching info
            dispatch(getServiceInfoById(selectedServiceId));
        }
        dispatch(getAllServiceTypes()); // Also refresh main services to update counts if any
      } catch (err) {
        console.error('Failed to delete sub-service:', err);
        setOperationError(t.subServiceDeleteFailed);
      }
    }
  };

  const handleDeleteMainService = async (id) => {
    setOperationSuccess(null);
    setOperationError(null);

    if (window.confirm(t.confirmDeleteMainService)) {
      try {
        await dispatch(deleteMainServiceType(id)).unwrap();
        setOperationSuccess(t.mainServiceDeletedSuccess);
        dispatch(getAllServiceTypes()); // Refresh main service types
        if (selectedServiceId === id) { // Clear selected info if current main service is deleted
          dispatch(setSelectedServiceId(null));
        }
      } catch (err) {
        console.error('Failed to delete main service type:', err);
        setOperationError(t.mainServiceDeleteFailed);
      }
    }
  };

  const handleNavigateToProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      setOperationError(t.userIdNotAvailable);
    }
  };

  const handleAddMainService = async () => {
    setOperationSuccess(null);
    setOperationError(null);

    if (!newMainServiceTypeName.trim()) {
      setOperationError(t.serviceNameEmptyError);
      return;
    }

    try {
      await dispatch(createServiceType(newMainServiceTypeName.trim())).unwrap();
      setOperationSuccess(t.mainServiceAddedSuccess);
      setNewMainServiceTypeName('');
      setAddMainServiceModalOpen(false);
      dispatch(getAllServiceTypes()); // Refresh main service types
    } catch (err) {
      console.error('Failed to add main service:', err);
      // More specific error handling from backend if available, otherwise generic
      const errorMessage = err?.message || t.mainServiceAddFailed;
      setOperationError(errorMessage);
    }
  };

  return (
    <div className="services-management">
      <Sidebar />
      <main className={`main-content ${translateMode ? "en" : "ar"}`}>
        <div className="header">
          <h2 className="page-title">{t.pageTitle}</h2>
          <div className="action-buttons-group">
             {/* Add Sub Service Button - only appears when a main service is selected */}
            {selectedServiceId && (
              <button className="add-btn" onClick={() => setAddSubServiceModalOpen(true)} aria-label={t.addSubServiceButton}>
                <FaPlusCircle /> {t.addSubServiceButton}
              </button>
            )}
            
            <button className="add-btn" onClick={() => setAddMainServiceModalOpen(true)} aria-label={t.addMainServiceButton}>
              <FaPlusCircle /> {t.addMainServiceButton}
            </button>
          </div>
        </div>

        {operationSuccess && (
          <p className="status-message success-message">
            <FaCheckCircle /> {operationSuccess}
          </p>
        )}
        {operationError && (
          <p className="status-message error-message">
            <FaExclamationCircle /> {operationError}
          </p>
        )}

        <div className="services-section">
          <h3 className="section-title">{t.mainServiceTypesTitle}</h3>
          {servicesLoading && (
            <p className="status-message loading-message">
              {t.loadingMainServices}
            </p>
          )}
          {servicesError && (
            <p className="status-message error-message">
              <FaExclamationCircle /> {t.errorLoadingMainServices}
            </p>
          )}
          {!servicesLoading && !servicesError && services.length === 0 && (
            <p className="status-message no-data-message">
              {t.noMainServiceTypesFound}
            </p>
          )}

          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-card ${selectedServiceId === service.id ? 'selected' : ''}`}
                onClick={() => handleSelectService(service.id)}
                role="button"
                tabIndex="0"
                aria-label={t.selectService + ' ' + service.type}
              >
                <h3>{service.type}</h3>
                <button
                  className="delete-main-btn"
                  title={t.deleteMainServiceTitle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMainService(service.id);
                  }}
                  aria-label={t.deleteMainServiceTitle + ' ' + service.type}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedServiceId && (
          <div className="sub-services-section">
            <h3 className="section-title">
              {t.subServicesTitle}
            </h3>
            {serviceInfoLoading && (
              <p className="status-message loading-message">
                {t.loadingSubServices}
              </p>
            )}
            {serviceInfoError && (
              <p className="status-message error-message">
                <FaExclamationCircle /> {t.errorLoadingSubServices}
              </p>
            )}
            {!serviceInfoLoading && !serviceInfoError && (!Array.isArray(selectedServiceInfo) || selectedServiceInfo.length === 0) ? (
              <p className="status-message no-data-message">
                {t.noSubServicesFound}
              </p>
            ) : (
              <div className="subservices-grid">
                {Array.isArray(selectedServiceInfo) && selectedServiceInfo.map((info) => (
                  <div key={info.id} className="subservice-card">
                    <h4>{info.title}</h4>
                    <p>{info.description}</p>
                    <small>
                      {t.publishedBy}{' '}
                      <span
                        className="publisher-link"
                        onClick={() => handleNavigateToProfile(info.users_info?.id)}
                        role="link"
                        tabIndex="0"
                        aria-label={t.viewProfile + ' ' + (info.users_info?.name || t.unknown)}
                      >
                        {info.users_info?.name || t.unknown}
                      </span>
                    </small>
                    <button
                      className="delete-subservice-btn"
                      title={t.deleteSubServiceTitle}
                      onClick={() => handleDeleteSubService(info.id)}
                      aria-label={t.deleteSubServiceTitle + ' ' + info.title}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Sub Service Modal - remains unchanged */}
        <AddServiceModal
          isOpen={isAddSubServiceModalOpen}
          onClose={() => setAddSubServiceModalOpen(false)}
          onServiceAdded={() => {
            dispatch(getAllServiceTypes());
            if (selectedServiceId) {
              dispatch(getServiceInfoById(selectedServiceId));
            }
          }}
          translateMode={translateMode}
          mainServiceId={selectedServiceId} // Pass selectedServiceId to AddServiceModal
        />

        {/* Add Main Service Modal - MODIFIED TO INCLUDE BUTTONS */}
        {isAddMainServiceModalOpen && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <h2>{t.addMainServiceModalTitle}</h2>
              <input
                type="text"
                value={newMainServiceTypeName}
                onChange={(e) => setNewMainServiceTypeName(e.target.value)}
                placeholder={t.enterServiceNamePlaceholder}
                aria-label={t.enterServiceNamePlaceholder}
              />
              <div className="modal-actions">
                <button onClick={handleAddMainService} className="confirm-btn"> {/* Changed class to confirm-btn */}
                  <FaPlusCircle /> {t.add}
                </button>
                <button onClick={() => setAddMainServiceModalOpen(false)} className="cancel-btn">
                  <FaTimesCircle /> {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServicesManagement;