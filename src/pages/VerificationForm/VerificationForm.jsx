import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendvertificationRequest } from '../../features/office/officeSlice';
import './VerificationForm.scss';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar/SideBar';
import { DarkModeContext } from '../../context/DarkModeContext';
import SelectOfficeModal from '../../components/SelectOfficeModal/SelectOfficeModal';
import { FaShieldAlt, FaIdCard, FaFileAlt, FaPaperPlane, FaSpinner, FaEye, FaCheckCircle, FaExclamationCircle, FaUsers } from 'react-icons/fa';

const VerificationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translateMode } = useContext(DarkModeContext);

  const { loading: sendLoading, error: sendError } = useSelector((state) => state.office);

  const [form, setForm] = useState({
    national_no: '',
    identity_no: '',
    user_id: '',
    identity_image: null,
    contract_image: null,
  });

  const [previews, setPreviews] = useState({
    identity_image: '',
    contract_image: '',
  });

  const [formValidationErrors, setFormValidationErrors] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);

  const t = {
    title: translateMode ? "Create Verification Request" : "🛡️ إنشاء طلب توثيق",
    nationalNoLabel: translateMode ? "National Number" : "الرقم الوطني",
    identityNoLabel: translateMode ? "Identity Number" : "رقم الهوية",
    userIdLabel: translateMode ? "Selected Office ID" : "معرف المكتب المحدد",
    selectUserButton: translateMode ? "Select Office" : "اختر المكتب",
    identityImageLabel: translateMode ? "Identity Image" : "صورة الهوية",
    contractImageLabel: translateMode ? "Contract Image" : "صورة العقد",
    nationalNoPlaceholder: translateMode ? "Enter National Number" : "أدخل الرقم الوطني",
    identityNoPlaceholder: translateMode ? "Enter Identity Number" : "أدخل رقم الهوية",
    userIdPlaceholder: translateMode ? "Select an office..." : "اختر مكتبًا...",
    identityImagePreviewAlt: translateMode ? "Identity Preview" : "معاينة الهوية",
    contractImagePreviewAlt: translateMode ? "Contract Preview" : "معاينة العقد",
    sendRequest: translateMode ? "Send Request" : "إرسال الطلب",
    sending: translateMode ? "Sending..." : "جاري الإرسال...",
    viewVerifications: translateMode ? "View Available Verifications" : "👁️ عرض التوثيقات المتاحة",
    requiredField: translateMode ? "This field is required." : "هذا الحقل مطلوب.",
    invalidNumber: translateMode ? "Must be a valid number." : "يجب أن يكون رقماً صحيحاً.",
    imageRequired: translateMode ? "Image is required." : "الصورة مطلوبة.",
    submissionSuccess: translateMode ? "Verification request sent successfully!" : "تم إرسال طلب التوثيق بنجاح!",
    submissionError: translateMode ? "Failed to send verification request. Please try again." : "فشل إرسال طلب التوثيق. الرجاء المحاولة مرة أخرى.",
  };

  const validateForm = () => {
    const errors = {};
    if (!form.national_no.trim()) errors.national_no = t.requiredField;
    if (!form.identity_no.trim()) errors.identity_no = t.requiredField;
    if (!form.user_id) errors.user_id = t.requiredField;
    if (!form.identity_image) errors.identity_image = t.imageRequired;
    if (!form.contract_image) errors.contract_image = t.imageRequired;
    setFormValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setForm({ ...form, [name]: file });
      setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
    } else {
      setForm({ ...form, [name]: value });
    }
    setFormValidationErrors(prev => ({ ...prev, [name]: undefined }));
    setSubmissionSuccess(null);
  };

  const handleSelectOffice = (officeId) => {
    setForm(prev => ({ ...prev, user_id: officeId }));
    setIsOfficeModalOpen(false);
    setFormValidationErrors(prev => ({ ...prev, user_id: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionSuccess(null);
    setFormValidationErrors({});

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await dispatch(sendvertificationRequest(formData)).unwrap();
      setSubmissionSuccess(t.submissionSuccess);
      setForm({
        national_no: '',
        identity_no: '',
        user_id: '',
        identity_image: null,
        contract_image: null,
      });
      setPreviews({
        identity_image: '',
        contract_image: '',
      });
    } catch (err) {
      console.error("Verification request failed:", err);
      setSubmissionSuccess(null);
      setFormValidationErrors(prev => ({ ...prev, submission: typeof sendError === 'object' && sendError.message ? sendError.message : t.submissionError }));
    }
  };

  return (
    <div className={`verification-page-wrapper ${translateMode ? 'ltr' : 'rtl'}`}>
      <Sidebar />
      <div className="verification-card">
        <h2 className="card-title">
          <FaShieldAlt className="title-icon" /> {t.title}
        </h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="national_no">{t.nationalNoLabel}</label>
            <input
              type="text"
              id="national_no"
              name="national_no"
              value={form.national_no}
              onChange={handleChange}
              placeholder={t.nationalNoPlaceholder}
              aria-invalid={!!formValidationErrors.national_no}
              aria-describedby={formValidationErrors.national_no ? "national_no_error" : undefined}
            />
            {formValidationErrors.national_no && <p id="national_no_error" className="error-message"><FaExclamationCircle /> {formValidationErrors.national_no}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="identity_no">{t.identityNoLabel}</label>
            <input
              type="text"
              id="identity_no"
              name="identity_no"
              value={form.identity_no}
              onChange={handleChange}
              placeholder={t.identityNoPlaceholder}
              aria-invalid={!!formValidationErrors.identity_no}
              aria-describedby={formValidationErrors.identity_no ? "identity_no_error" : undefined}
            />
            {formValidationErrors.identity_no && <p id="identity_no_error" className="error-message"><FaExclamationCircle /> {formValidationErrors.identity_no}</p>}
          </div>

          {/* User ID field with Select Office Button - MODIFIED FOR SIDE-BY-SIDE */}
          <div className="form-field">
            <label htmlFor="user_id_display">{t.userIdLabel}</label>
            <div className="user-id-select-group">
                <input
                    type="text"
                    id="user_id_display"
                    value={form.user_id ? `ID: ${form.user_id}` : ''}
                    placeholder={t.userIdPlaceholder}
                    readOnly
                    onClick={() => setIsOfficeModalOpen(true)}
                    aria-invalid={!!formValidationErrors.user_id}
                    aria-describedby={formValidationErrors.user_id ? "user_id_error" : undefined}
                />
                <button
                    type="button"
                    className="select-office-btn"
                    onClick={() => setIsOfficeModalOpen(true)}
                    aria-label={t.selectUserButton}
                >
                    <FaUsers /> {t.selectUserButton}
                </button>
            </div>
            {formValidationErrors.user_id && <p id="user_id_error" className="error-message"><FaExclamationCircle /> {formValidationErrors.user_id}</p>}
          </div>

          {/* Group for Identity Image and Contract Image */}
          <div className="image-upload-group">
            {/* Identity Image Upload Field */}
            <div className="form-field image-upload">
              <label>{t.identityImageLabel}</label>
              <div className="upload-button-wrapper">
                <input
                  type="file"
                  id="identity_image"
                  name="identity_image"
                  accept="image/*"
                  onChange={handleChange}
                  aria-invalid={!!formValidationErrors.identity_image}
                  aria-describedby={formValidationErrors.identity_image ? "identity_image_error" : undefined}
                />
                <label htmlFor="identity_image" className="custom-upload-button">
                  <FaIdCard className="upload-icon" /> {t.identityImageLabel}
                </label>
              </div>
              {previews.identity_image && (
                <img src={previews.identity_image} alt={t.identityImagePreviewAlt} className="image-preview" />
              )}
              {formValidationErrors.identity_image && <p id="identity_image_error" className="error-message"><FaExclamationCircle /> {formValidationErrors.identity_image}</p>}
            </div>

            {/* Contract Image Upload Field */}
            <div className="form-field image-upload">
              <label>{t.contractImageLabel}</label>
              <div className="upload-button-wrapper">
                <input
                  type="file"
                  id="contract_image"
                  name="contract_image"
                  accept="image/*"
                  onChange={handleChange}
                  aria-invalid={!!formValidationErrors.contract_image}
                  aria-describedby={formValidationErrors.contract_image ? "contract_image_error" : undefined}
                />
                <label htmlFor="contract_image" className="custom-upload-button">
                  <FaFileAlt className="upload-icon" /> {t.contractImageLabel}
                </label>
              </div>
              {previews.contract_image && (
                <img src={previews.contract_image} alt={t.contractImagePreviewAlt} className="image-preview" />
              )}
              {formValidationErrors.contract_image && <p id="contract_image_error" className="error-message"><FaExclamationCircle /> {formValidationErrors.contract_image}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={sendLoading}>
              {sendLoading ? (
                <> <FaSpinner className="spinner" /> {t.sending} </>
              ) : (
                <> <FaPaperPlane /> {t.sendRequest} </>
              )}
            </button>
            {sendError && (
              <p className="status-message error-message">
                <FaExclamationCircle /> {typeof sendError === 'object' && sendError.message ? sendError.message : t.submissionError}
              </p>
            )}
            {submissionSuccess && (
              <p className="status-message success-message">
                <FaCheckCircle /> {submissionSuccess}
              </p>
            )}
            {formValidationErrors.submission && (
                <p className="status-message error-message">
                    <FaExclamationCircle /> {formValidationErrors.submission}
                </p>
            )}
          </div>
        </form>
        <button className="view-verifications-btn" onClick={() => navigate('/verificationlist')}>
          <FaEye /> {t.viewVerifications}
        </button>
      </div>

      {/* Select Office Modal */}
      <SelectOfficeModal
        isOpen={isOfficeModalOpen}
        onClose={() => setIsOfficeModalOpen(false)}
        onSelectOffice={handleSelectOffice}
      />
    </div>
  );
};

export default VerificationForm;