import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar/SideBar';
import { getAllUsers } from '../../features/auth/authSlice'; // Assuming this is correct
import { getLocation } from '../../features/realEstate/realEstateSlice'; // Assuming this is correct
import { DarkModeContext } from '../../context/DarkModeContext';
import './Dahboard.scss';
import { 
  FaChartLine, // Main dashboard title icon
  FaUsers, // Users icon for total users stat
  FaHome, // Home icon for total properties stat
  FaBuilding, // Building icon for active offices stat
  FaCheckCircle, // Checkmark for pending verifications stat
} from 'react-icons/fa'; 

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translateMode } = useContext(DarkModeContext);

  // Dummy data for top mini-stats (replace with actual Redux data if available)
  const miniStats = {
    totalUsers: 1250,
    totalProperties: 3450,
    activeOffices: 85,
    pendingVerifications: 12,
  };

  const t = {
    dashboardTitle: translateMode ? 'Admin Dashboard Overview' : '📊 نظرة عامة على لوحة التحكم',
    totalUsers: translateMode ? 'Total Users' : 'إجمالي المستخدمين',
    totalProperties: translateMode ? 'Total Properties' : 'إجمالي العقارات',
    activeOffices: translateMode ? 'Active Offices' : 'المكاتب النشطة',
    pendingVerifications: translateMode ? 'Pending Verifications' : 'طلبات التوثيق المعلقة',
    quickAccess: translateMode ? 'Quick Access' : 'الوصول السريع',
    manageOffices: translateMode ? 'Manage Offices' : 'إدارة المكاتب',
    manageLocations: translateMode ? 'Manage Locations' : 'إدارة المناطق',
    manageProperties: translateMode ? 'Manage Properties' : 'إدارة العقارات',
    manageServices: translateMode ? 'Manage Services' : 'إدارة الخدمات',
    verificationRequests: translateMode ? 'Verification Requests' : 'طلبات التوثيق',
    userComplaints: translateMode ? 'User Complaints' : 'شكاوى المستخدمين'
  };

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getLocation());
  }, [dispatch]);

  return (
    <div className={`admin-dashboard ${translateMode ? 'ltr' : 'rtl'}`}>
      <Sidebar />
      <main className="main-content">
        <h2 className="dashboard-page-title">
          <FaChartLine className="title-icon" /> {t.dashboardTitle}
        </h2>

        {/* Mini Stats Section */}
        <section className="mini-stats-section">
          <div className="mini-stat-card">
            <FaUsers className="stat-icon" />
            <span className="stat-value">{miniStats.totalUsers.toLocaleString()}</span>
            <span className="stat-label">{t.totalUsers}</span>
          </div>
          <div className="mini-stat-card">
            <FaHome className="stat-icon" />
            <span className="stat-value">{miniStats.totalProperties.toLocaleString()}</span>
            <span className="stat-label">{t.totalProperties}</span>
          </div>
          <div className="mini-stat-card">
            <FaBuilding className="stat-icon" />
            <span className="stat-value">{miniStats.activeOffices}</span>
            <span className="stat-label">{t.activeOffices}</span>
          </div>
          <div className="mini-stat-card">
            <FaCheckCircle className="stat-icon" />
            <span className="stat-value">{miniStats.pendingVerifications}</span>
            <span className="stat-label">{t.pendingVerifications}</span>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section className="quick-access-section">
          <h3 className="section-subtitle">{t.quickAccess}</h3>
          <div className="stats-grid">
            <div className="card" onClick={() => navigate('/officemanagement')}>
              {/* Removed FaBuilding icon from here */}
              <p>{t.manageOffices}</p>
            </div>
            <div className="card" onClick={() => navigate('/locationmanagement')}>
              {/* Removed FaMapMarkerAlt icon from here */}
              <p>{t.manageLocations}</p>
            </div>
            <div className="card" onClick={() => navigate('/home')}>
              {/* Removed FaHome icon from here */}
              <p>{t.manageProperties}</p>
            </div>
            <div className="card" onClick={() => navigate('/servicesmanagement')}>
              {/* Removed FaTools icon from here */}
              <p>{t.manageServices}</p>
            </div>
            <div className="card" onClick={() => navigate('/verifications')}>
              {/* Removed FaCheckCircle icon from here */}
              <p>{t.verificationRequests}</p>
            </div>
            <div className="card" onClick={() => navigate('/complaints')}>
              {/* Removed FaComments icon from here */}
              <p>{t.userComplaints}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;