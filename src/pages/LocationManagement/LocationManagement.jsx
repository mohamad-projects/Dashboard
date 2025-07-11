import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLocation, deleteLocation, getLocation } from '../../features/realEstate/realEstateSlice';
import { FaMapMarkerAlt, FaTrash, FaPlusCircle } from 'react-icons/fa'; // Added FaPlusCircle
import Sidebar from '../../components/SideBar/SideBar';
import { DarkModeContext } from '../../context/DarkModeContext';
import './LocationManagement.scss';

const LocationManagement = () => {
  const dispatch = useDispatch();
  const { translateMode } = useContext(DarkModeContext);

  // Destructure locations, loading, and error.
  // Crucially, provide a default empty array for 'locations' if it's not an array
  // from the Redux state, especially during initial render or before data loads.
  const { locations: reduxLocations, loading, error: fetchError } = useSelector(state => state.realestate);

  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [formError, setFormError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    dispatch(getLocation());
  }, [dispatch]);

  // Ensure 'locations' is always an array before rendering.
  // If your API returns data in a 'data' field, like { data: [...], meta: {...} }
  // then you should use reduxLocations?.data || [];
  const locations = Array.isArray(reduxLocations) ? reduxLocations : reduxLocations?.data || [];


  const handleAddLocation = async (e) => {
    e.preventDefault();
    setFormError(null);
    setAddSuccess(null);
    setDeleteError(null);
    setDeleteSuccess(null);

    if (!city.trim() || !district.trim()) {
      setFormError(translateMode ? 'Both city and district fields are required.' : 'يجب تعبئة حقلي المدينة والمنطقة.');
      return;
    }

    try {
      await dispatch(addLocation({ city, district })).unwrap();
      setCity('');
      setDistrict('');
      setFormError(null);
      setAddSuccess(translateMode ? 'Location added successfully!' : 'تمت إضافة المنطقة بنجاح!');
      dispatch(getLocation());
    } catch (err) {
      console.error('Failed to add location:', err);
      setFormError(
        translateMode
          ? `Failed to add location: ${err.message || 'Unknown error'}`
          : `فشل إضافة المنطقة: ${err.message || 'خطأ غير معروف'}`
      );
    }
  };

  const handleDeleteLocation = async (id) => {
    setDeleteError(null);
    setDeleteSuccess(null);
    setAddSuccess(null);

    if (!window.confirm(translateMode ? 'Are you sure you want to delete this location?' : 'هل أنت متأكد من حذف هذه المنطقة؟')) {
      return;
    }

    try {
      await dispatch(deleteLocation(id)).unwrap();
      setDeleteSuccess(translateMode ? 'Location deleted successfully!' : 'تم حذف المنطقة بنجاح!');
      dispatch(getLocation());
    } catch (err) {
      console.error('Failed to delete location:', err);
      setDeleteError(
        translateMode
          ? `Failed to delete location: ${err.message || 'Unknown error'}`
          : `فشل حذف المنطقة: ${err.message || 'خطأ غير معروف'}`
      );
    }
  };

  return (
    <div className={`admin-dashboard ${translateMode ? 'en' : 'ar'}`}>
      <Sidebar />
      <main className="main">
        <h2 className="page-title">
          {translateMode ? 'Location Management' : 'إدارة المناطق'}
        </h2>

        <form className="location-form" onSubmit={handleAddLocation}>
          <input
            type="text"
            placeholder={translateMode ? 'City' : 'المدينة'}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label={translateMode ? 'Enter city name' : 'أدخل اسم المدينة'}
          />
          <input
            type="text"
            placeholder={translateMode ? 'District' : 'المنطقة'}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            aria-label={translateMode ? 'Enter district name' : 'أدخل اسم المنطقة'}
          />
          <button type="submit" aria-label={translateMode ? 'Add new location' : 'إضافة منطقة جديدة'}>
            <FaPlusCircle /> {translateMode ? 'Add Location' : 'إضافة منطقة'}
          </button>
          {formError && <p className="status-message error-message">{formError}</p>}
          {addSuccess && <p className="status-message success-message">{addSuccess}</p>}
        </form>

        <div className="locations-list-section">
          {loading && <p className="status-message loading-message">{translateMode ? 'Loading locations...' : 'جاري تحميل المناطق...'}</p>}
          {fetchError && <p className="status-message error-message">{translateMode ? `Error fetching locations: ${fetchError.message || 'Unknown error'}` : `خطأ في جلب المناطق: ${fetchError.message || 'خطأ غير معروف'}`}</p>}
          {deleteError && <p className="status-message error-message delete-error-shake">{deleteError}</p>}
          {deleteSuccess && <p className="status-message success-message">{deleteSuccess}</p>}

          {!loading && !fetchError && locations.length === 0 ? (
            <p className="status-message no-data-message">{translateMode ? 'No locations found.' : 'لا توجد مناطق.'}</p>
          ) : (
            <div className="locations-grid">
              {locations.map(loc => (
                <div className="location-card" key={loc.id}>
                  <div className="info">
                    <FaMapMarkerAlt className="marker-icon" />
                    <span>{loc.city} - {loc.district}</span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteLocation(loc.id)}
                    aria-label={translateMode ? `Delete ${loc.city}, ${loc.district}` : `حذف ${loc.city}, ${loc.district}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LocationManagement;