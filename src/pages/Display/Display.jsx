import { FaBed, FaRulerCombined, FaTrash } from 'react-icons/fa'; // Import FaTrash
import './Display.scss';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/ddd.jpg';

const Display = ({
    properties,
    lastPage,
    currentPage,
    handlePageChange,
    translateMode,
    showActions = false, // New prop for conditional rendering of action buttons
    onDelete, // New prop for delete action
}) => {
    const navigate = useNavigate();

    const handleMoreDetails = (id) => {
        navigate(`/property/${id}`);
    };

    return (
        <div className="display-page">
            <div className="properties-container">
                {properties.map((property) => (
                    <div className="property-card" key={property.id}>
                        <div className="image-section">
                            <img
                                src={
                                    property.images && property.images.length > 0
                                        ? `http://localhost:8000/storage/real-estate/${property.images[0].name}`
                                        : image
                                }
                                alt="property"
                            />
                        </div>

                        <div className="details-section">
                            <div className="details-row">
                                <div className="detail-item bg-light">
                                    <FaBed className="icon" />
                                    <div>
                                        <span className="value">{property.properties?.room_no ?? 'N/A'}</span>
                                        <span className="label">{translateMode ? 'Beds' : 'غرف'}</span>
                                    </div>
                                </div>

                                <div className="detail-item bg-light">
                                    <FaRulerCombined className="icon" />
                                    <div>
                                        <span className="value">{property.properties?.space_status ?? 'N/A'} m²</span>
                                        <span className="label">{translateMode ? 'Area' : 'المساحة'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section bg-light">
                                <div className="price">{property.price ?? 0} $</div>
                                <div className="location">
                                    <span>{translateMode ? 'Location:' : 'الموقع:'} </span>
                                    {property.location?.city}, {property.location?.district}
                                </div>
                            </div>

                            {/* New: Conditional rendering for action buttons */}
                            {showActions && (
                                <div className="action-buttons">
                                    <button
                                        className="action-icon delete"
                                        onClick={() => onDelete(property.id)}
                                        title={translateMode ? 'Delete property' : 'حذف العقار'}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            className="more-details-btn"
                            onClick={() => handleMoreDetails(property.id)}
                        >
                            {translateMode ? 'More Details' : 'المزيد من التفاصيل'}
                        </button>
                    </div>
                ))}
            </div>

            {handlePageChange && (
                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        {translateMode ? 'Previous' : 'السابق'}
                    </button>

                    <span>
                        {translateMode ? 'Page' : 'الصفحة'} {currentPage} / {lastPage}
                    </span>

                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>
                        {translateMode ? 'Next' : 'التالي'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Display;