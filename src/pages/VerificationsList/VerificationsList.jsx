import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getVerifications,
  updateVerification,
  deleteVerification,
} from '../../features/office/officeSlice'; // Assuming officeSlice handles these
import './VerificationsList.scss';
import Sidebar from '../../components/SideBar/SideBar';
import { DarkModeContext } from '../../context/DarkModeContext';
import { FaEdit, FaTrashAlt,FaSpinner, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaSyncAlt, FaExclamationCircle, FaUser, FaIdCard, FaFileAlt, FaLockOpen, FaLock, FaAngleLeft, FaAngleRight, FaEye } from 'react-icons/fa'; // Import necessary icons

const VerificationsList = () => {
  const dispatch = useDispatch();
  const { translateMode } = useContext(DarkModeContext);

  // Destructure Redux state for clarity and safety
  const {
    verifications: verificationsResponse, // Raw response object from API
    loading: fetchLoading, 
    error: fetchError, 
    loading: updateDeleteLoading, 
    error: updateDeleteError, 
  } = useSelector((state) => state.office);

  const verifications = verificationsResponse?.data || [];
  const paginationMeta = verificationsResponse || {}; 
  const [editForm, setEditForm] = useState(null);
  const [preview, setPreview] = useState({
    identity_image: '',
    contract_image: '',
  });

  const [operationSuccess, setOperationSuccess] = useState(null);
  const [operationError, setOperationError] = useState(null);

  const t = {
    pageTitle: translateMode ? 'Verification Requests List' : '📋 قائمة طلبات التوثيق',
    loading: translateMode ? 'Loading verifications...' : 'جاري تحميل طلبات التوثيق...',
    fetchError: translateMode ? 'Failed to load verifications.' : 'فشل تحميل طلبات التوثيق.',
    noVerifications: translateMode ? 'No verification requests found.' : 'لم يتم العثور على طلبات توثيق.',
    nationalNo: translateMode ? 'National Number:' : 'الرقم الوطني:',
    identityNo: translateMode ? 'Identity Number:' : 'رقم الهوية:',
    status: translateMode ? 'Status:' : 'الحالة:',
    active: translateMode ? '✅ Active' : '✅ مفعل',
    inactive: translateMode ? '❌ Inactive' : '❌ غير مفعل',
    user: translateMode ? 'User:' : 'المستخدم:',
    identityImage: translateMode ? 'Identity Image' : 'صورة الهوية',
    contractImage: translateMode ? 'Contract Image' : 'صورة العقد',
    edit: translateMode ? 'Edit' : 'تعديل',
    delete: translateMode ? 'Delete' : 'حذف',
    confirmDelete: translateMode ? 'Are you sure you want to delete this request?' : 'هل أنت متأكد أنك تريد حذف هذا الطلب؟',
    editTitle: translateMode ? 'Edit Verification Request' : '📝 تعديل طلب التوثيق',
    save: translateMode ? 'Save' : 'حفظ',
    cancel: translateMode ? 'Cancel' : 'إلغاء',
    updateSuccess: translateMode ? 'Verification updated successfully!' : 'تم تحديث طلب التوثيق بنجاح!',
    updateError: translateMode ? 'Failed to update verification.' : 'فشل تحديث طلب التوثيق.',
    deleteSuccess: translateMode ? 'Verification deleted successfully!' : 'تم حذف طلب التوثيق بنجاح!',
    deleteError: translateMode ? 'Failed to delete verification.' : 'فشل حذف طلب التوثيق.',
    identityImagePlaceholder: translateMode ? 'Identity Image' : 'صورة الهوية',
    contractImagePlaceholder: translateMode ? 'Contract Image' : 'صورة العقد',
    selectActivation: translateMode ? 'Select Activation Status' : 'اختر حالة التفعيل',
    prev: translateMode ? 'Previous' : 'السابق',
    next: translateMode ? 'Next' : 'التالي',
    page: translateMode ? 'Page' : 'صفحة',
  };

  useEffect(() => {
    dispatch(getVerifications()); // Fetch initial list on mount
  }, [dispatch]);

  const handleEditClick = (item) => {
    setEditForm({
      ...item,
      identity_image: item.identity_image,
      contract_image: item.contract_image,
    });
    setPreview({
      identity_image: `http://127.0.0.1:8000/storage/${item.identity_image}`,
      contract_image: `http://127.0.0.1:8000/storage/${item.contract_image}`,
    });
    setOperationSuccess(null);
    setOperationError(null);
  };

  const handleDelete = async (id) => {
    setOperationSuccess(null);
    setOperationError(null);
    if (window.confirm(t.confirmDelete)) {
      try {
        await dispatch(deleteVerification(id)).unwrap(); // Use unwrap() for error handling
        setOperationSuccess(t.deleteSuccess);
        dispatch(getVerifications(paginationMeta.current_page)); // Refresh current page after delete
      } catch (err) {
        console.error('Delete verification failed:', err);
        setOperationError(typeof err === 'object' && err.message ? err.message : t.deleteError);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setEditForm({ ...editForm, [name]: file });
      setPreview({ ...preview, [name]: URL.createObjectURL(file) });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationSuccess(null);
    setOperationError(null);

    const formData = new FormData();
    formData.append('national_no', editForm.national_no);
    formData.append('identity_no', editForm.identity_no);
    formData.append('user_id', editForm.user_id);
    formData.append('activation', editForm.activation);

    if (editForm.identity_image instanceof File) {
      formData.append('identity_image', editForm.identity_image);
    }
    if (editForm.contract_image instanceof File) {
      formData.append('contract_image', editForm.contract_image);
    }

    try {
      await dispatch(updateVerification({ id: editForm.id, data: formData })).unwrap();
      setOperationSuccess(t.updateSuccess);
      setEditForm(null); // Close modal on success
      dispatch(getVerifications(paginationMeta.current_page)); // Refresh current page after update
    } catch (err) {
      console.error('Update verification failed:', err);
      setOperationError(typeof err === 'object' && err.message ? err.message : t.updateError);
    }
  };

  const handlePageChange = (pageUrl) => {
    // Extract page number from the URL
    const url = new URL(pageUrl);
    const page = url.searchParams.get('page');
    dispatch(getVerifications(page));
  };

  const directionClass = translateMode ? 'ltr' : 'rtl';

  return (
    <div className={`verifications-page ${directionClass}`}>
      <Sidebar />
      <div className={`verifications-container ${directionClass}`}>
        <h2 className="verifications-title">
          <FaInfoCircle className="title-icon" /> {t.pageTitle}
        </h2>

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
        {updateDeleteError && typeof updateDeleteError === 'object' && updateDeleteError.message && (
            <p className="status-message error-message">
                <FaExclamationCircle /> {updateDeleteError.message}
            </p>
        )}

        {fetchLoading && (
          <p className="status-message loading-message">
            <FaSyncAlt className="spinner" /> {t.loading}
          </p>
        )}
        {fetchError && typeof fetchError === 'object' && fetchError.message && (
          <p className="status-message error-message">
            <FaExclamationCircle /> {t.fetchError}: {fetchError.message}
          </p>
        )}
        {!fetchLoading && !fetchError && verifications.length === 0 && (
          <p className="status-message no-data-message">
            <FaInfoCircle /> {t.noVerifications}
          </p>
        )}

        <div className="verifications-grid">
          {verifications.map((item) => (
            <div key={item.id} className="verification-card">
              <div className="card-info">
                <p><FaIdCard /> <strong>{t.nationalNo}</strong> {item.national_no}</p>
                <p><FaIdCard /> <strong>{t.identityNo}</strong> {item.identity_no}</p>
                <p>
                  {item.activation === "1" ? (
                    <> <FaLockOpen /> <strong>{t.status}</strong> {t.active} </>
                  ) : (
                    <> <FaLock /> <strong>{t.status}</strong> {t.inactive} </>
                  )}
                </p>
                <p><FaUser /> <strong>{t.user}</strong> {item.users_info?.name || (translateMode ? 'N/A' : 'غير متوفر')}</p>
              </div>
              <div className="card-images">
                <div className="image-wrapper">
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.identity_image}`}
                    alt={t.identityImage}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/fallback-image.jpg'; }} // Fallback image path
                  />
                  <span className="image-label">{t.identityImage}</span>
                </div>
                <div className="image-wrapper">
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.contract_image}`}
                    alt={t.contractImage}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/fallback-image.jpg'; }} // Fallback image path
                  />
                  <span className="image-label">{t.contractImage}</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(item)}
                  aria-label={translateMode ? `Edit request for ${item.users_info?.name}` : `تعديل طلب ${item.users_info?.name}`}
                  disabled={updateDeleteLoading}
                >
                  <FaEdit /> {t.edit}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                  aria-label={translateMode ? `Delete request for ${item.users_info?.name}` : `حذف طلب ${item.users_info?.name}`}
                  disabled={updateDeleteLoading}
                >
                  <FaTrashAlt /> {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {paginationMeta.last_page > 1 && (
          <div className="pagination">
            {paginationMeta.links && paginationMeta.links.map((link, index) => {
              // Skip rendering "previous" and "next" as text labels if they are not active links
              // and also skip the "..." links from Laravel pagination unless they are explicit numbers
              if (link.url === null || (!link.label.match(/^[0-9]+$/) && link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')) {
                return null;
              }

              // Special handling for previous and next links
              let label = link.label;
              if (label === '&laquo; Previous') {
                label = <FaAngleLeft />;
              } else if (label === 'Next &raquo;') {
                label = <FaAngleRight />;
              }

              return (
                <button
                  key={index}
                  className={`pagination-button ${link.active ? 'active' : ''}`}
                  onClick={() => handlePageChange(link.url)}
                  disabled={link.url === null || updateDeleteLoading || fetchLoading} // Disable if no URL or during loading
                  aria-label={link.active ? `${t.page} ${link.label}, current` : `${t.page} ${link.label}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {editForm && (
          <div className="edit-form-modal-backdrop">
            <div className="edit-form-modal-content">
              <form className="edit-form" onSubmit={handleSubmit}>
                <h3>
                  <FaEdit className="modal-title-icon" /> {t.editTitle}
                </h3>

                <div className="form-group">
                  <label htmlFor="edit_national_no">{t.nationalNo}</label>
                  <input type="text" id="edit_national_no" name="national_no" value={editForm.national_no} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="edit_identity_no">{t.identityNo}</label>
                  <input type="text" id="edit_identity_no" name="identity_no" value={editForm.identity_no} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="edit_user_id">{t.user}</label>
                  <input type="text" id="edit_user_id" name="user_id" value={editForm.user_id} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="edit_activation">{t.status}</label>
                  <select id="edit_activation" name="activation" value={editForm.activation} onChange={handleChange}>
                    <option value="1">{t.active}</option>
                    <option value="0">{t.inactive}</option>
                  </select>
                </div>

                <div className="form-group image-upload-field">
                  <label htmlFor="edit_identity_image"><FaIdCard /> {t.identityImagePlaceholder}</label>
                  <input type="file" id="edit_identity_image" name="identity_image" accept="image/*" onChange={handleChange} />
                  {preview.identity_image && <img src={preview.identity_image} alt={t.identityImagePlaceholder} className="image-preview" />}
                </div>

                <div className="form-group image-upload-field">
                  <label htmlFor="edit_contract_image"><FaFileAlt /> {t.contractImagePlaceholder}</label>
                  <input type="file" id="edit_contract_image" name="contract_image" accept="image/*" onChange={handleChange} />
                  {preview.contract_image && <img src={preview.contract_image} alt={t.contractImagePlaceholder} className="image-preview" />}
                </div>

                <div className="edit-actions">
                  <button type="submit" disabled={updateDeleteLoading}>
                    {updateDeleteLoading ? (
                      <> <FaSpinner className="spinner" /> {t.loading} </>
                    ) : (
                      <> <FaCheckCircle /> {t.save} </>
                    )}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setEditForm(null)} disabled={updateDeleteLoading}>
                    <FaTimesCircle /> {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationsList;