// src/components/AddServiceModal/AddServiceModal.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './AddServiceModal.scss';
import { getAllServiceTypes, setSelectedServiceId } from '../../features/auth/authService';
import api from '../../services/api';

const translations = {
  en: {
    titleEdit: 'Update Service',
    titleCreate: 'Add New Service',
    serviceType: 'Service Type:',
    titleLabel: 'Title:',
    descriptionLabel: 'Description:',
    submitBtnEdit: 'Update',
    submitBtnCreate: 'Publish Service',
    cancelBtn: 'Cancel',
    languageToggle: 'العربية',
  },
  ar: {
    titleEdit: 'تحديث الخدمة',
    titleCreate: 'إضافة خدمة جديدة',
    serviceType: 'نوع الخدمة:',
    titleLabel: 'العنوان:',
    descriptionLabel: 'الوصف:',
    submitBtnEdit: 'تحديث',
    submitBtnCreate: 'نشر الخدمة',
    cancelBtn: 'إلغاء',
    languageToggle: 'English',
  },
};

const AddServiceModal = ({
  isOpen,
  onClose,
  onServiceAdded,
  mode = 'create', // 'create' or 'edit'
  serviceToEdit = null,
}) => {
  const dispatch = useDispatch();
  const { services, selectedServiceId } = useSelector((state) => state.services);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lang, setLang] = useState('ar'); // 'ar' or 'en'

  // تحميل بيانات الخدمة عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllServiceTypes());
      if (mode === 'edit' && serviceToEdit) {
        setTitle(serviceToEdit.title || '');
        setDescription(serviceToEdit.description || '');
        dispatch(setSelectedServiceId(serviceToEdit.services_type_id));
      } else {
        setTitle('');
        setDescription('');
        dispatch(setSelectedServiceId(null));
      }
    }
  }, [isOpen, dispatch, serviceToEdit, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'edit') {
        await api.post(`/services/update/${serviceToEdit.id}`, {
          title,
          description,
          services_type_id: selectedServiceId,
        });
      } else {
        await api.post('/services/create', {
          title,
          description,
          services_type_id: selectedServiceId,
        });
      }

      onServiceAdded();
      onClose();
    } catch (err) {
      console.error('خطأ أثناء حفظ الخدمة:', err);
    }
  };

  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="modal-backdrop" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>{mode === 'edit' ? t.titleEdit : t.titleCreate}</h2>
          <button
            className="lang-toggle-btn"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            aria-label="Toggle Language"
          >
            {t.languageToggle}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>{t.serviceType}</label>
          <div className="service-types">
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-type ${selectedServiceId === service.id ? 'selected' : ''}`}
                onClick={() => dispatch(setSelectedServiceId(service.id))}
              >
                {lang === 'ar' ? service.type_ar || service.type : service.type_en || service.type}
              </div>
            ))}
          </div>

          <label>{t.titleLabel}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder={lang === 'ar' ? 'اكتب العنوان هنا' : 'Enter title here'}
          />

          <label>{t.descriptionLabel}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder={lang === 'ar' ? 'اكتب الوصف هنا' : 'Enter description here'}
          />

          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              {mode === 'edit' ? t.submitBtnEdit : t.submitBtnCreate}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              {t.cancelBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
