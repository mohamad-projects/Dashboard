import React, { useState, useContext, useEffect } from 'react';
import { getTranslations, getTranslatedOptions } from '../../TRANSLATIONS';
import houseImage from '../../assets/ddd.jpg';
import './Home.scss';
import { FaSearch } from 'react-icons/fa';
import { DarkModeContext } from '../../context/DarkModeContext';
import Display from '../Display/Display';
import { useDispatch, useSelector } from 'react-redux';
import { getStatus, deleteRealEstate } from '../../features/realestate/realEstateSlice';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { translateMode } = useContext(DarkModeContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const t = getTranslations(translateMode);
    const options = getTranslatedOptions(translateMode);

    const { data: statsData } = useSelector((state) => state.realestate.realEstateCount || {});
    const locations = useSelector((state) => state.realestate.locations?.data || []);
    const DATA = useSelector((state) => state.realestate.realEstate);

    const [properties, setProperties] = useState(DATA?.data?.data || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [activeButton, setActiveButton] = useState('buy');

    const [isFiltering, setIsFiltering] = useState(false);

    const [filters, setFilters] = useState({
        type: 'sale',
        kind: '',
        max_price: '',
        location: ''
    });

    const fetchProperties = async (page = 1) => {
        try {
            const response = await api.post(`RealEstate/index?page=${page}`);
            const result = response.data?.data;

            setProperties(result?.data || []);
            setCurrentPage(result?.current_page || 1);
            setLastPage(result?.last_page || 1);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handleFilteredFetch = async (page = 1) => {
        try {
            const formData = new FormData();
            formData.append('type', filters.type);
            formData.append('kind', filters.kind);
            formData.append('max_price', filters.max_price);
            formData.append('location', filters.location);

            const response = await api.post(`RealEstate/index?page=${page}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data?.data;
            setProperties(result?.data || []);
            setCurrentPage(result?.current_page || 1);
            setLastPage(result?.last_page || 1);
        } catch (error) {
            console.error('Error filtering properties:', error);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            if (isFiltering) {
                handleFilteredFetch(page);
            } else {
                fetchProperties(page);
            }
        }
    };

    const handleSearch = () => {
        setIsFiltering(true);
        handleFilteredFetch(1);
    };

    const handleDeleteProperty = async (id) => {
        try {
            await dispatch(deleteRealEstate(id)).unwrap();
            fetchProperties(currentPage);
        } catch (error) {
            console.error('Failed to delete property:', error);
            alert(translateMode ? 'Failed to delete property.' : 'فشل حذف العقار.');
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        fetchProperties(1);
        dispatch(getStatus());
    }, [dispatch]);

    useEffect(() => {
        setProperties(DATA?.data || []);
        setCurrentPage(DATA?.current_page || 1);
        setLastPage(DATA?.last_page || 1);
    }, [DATA]);

    return (
        <div className="home">
            <div className="main-content">
                <div className="left-section">
                    <h1>{t.common.title}</h1>
                    <p className="subtitle">{t.common.subtitle}</p>

                    <div className="action-buttons">
                        <button
                            className={`action-btn ${activeButton === 'buy' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveButton('buy');
                                setFilters(prev => ({ ...prev, type: 'sale' }));
                            }}
                        >
                            {t.buttons.buy}
                        </button>
                        <div className="divider"></div>
                        <button
                            className={`action-btn ${activeButton === 'rent' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveButton('rent');
                                setFilters(prev => ({ ...prev, type: 'rental' }));
                            }}
                        >
                            {t.buttons.rent}
                        </button>
                        <button
                            className="action-btn"
                            onClick={handleBackToDashboard}
                        >
                            {translateMode ? 'Back to Dashboard' : 'العودة إلى لوحة التحكم'}
                        </button>
                    </div>

                    <div className="search-filters">
                        <div className="filter-dropdown">
                            <input
                                type="number"
                                placeholder={t.filters.price}
                                value={filters.max_price}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, max_price: Number(e.target.value) }))
                                }
                            />
                        </div>

                        <div className="filter-dropdown">
                            <select
                                value={filters.location}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, location: e.target.value }))
                                }
                            >
                                <option value="">{translateMode ? 'Select Location' : 'اختر موقع'}</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.district}>
                                        {loc.district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-dropdown">
                            <select
                                value={filters.kind}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, kind: e.target.value }))
                                }
                            >
                                <option value="">{t.filters.type}</option>
                                {options.types.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <button className="search-btn" onClick={handleSearch}>
                            <FaSearch /> {t.common.search}
                        </button>
                    </div>
                </div>

                <div className="right-section">
                    <img src={houseImage} alt={t.common.title} />
                </div>
            </div>

            <div>
                <Display
                    properties={properties}
                    lastPage={lastPage}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    translateMode={translateMode}
                    showActions={true}
                    onDelete={handleDeleteProperty}
                />
            </div>

            <div className="stats-section">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">{statsData?.sale_count ?? '...'}</div>
                        <div className="stat-title">{t.stats.purchase}</div>
                        <div className="stat-icon">🏠</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">{statsData?.rental_count ?? '...'}</div>
                        <div className="stat-title">{t.stats.rent}</div>
                        <div className="stat-icon">🔑</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">24/7</div>
                        <div className="stat-title">{t.stats.support}</div>
                        <div className="stat-icon">📞</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;