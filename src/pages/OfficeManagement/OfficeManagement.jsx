// src/pages/Admin/OfficeManagement.jsx
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/SideBar/SideBar';
import './OfficeManagement.scss';
import { FaBuilding, FaPhone, FaWhatsapp, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';
import { DarkModeContext } from '../../context/DarkModeContext';
import { deleteOffice } from '../../features/office/officeSlice';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../features/auth/authSlice';

const OfficeManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translateMode } = useContext(DarkModeContext);

  useEffect(() => {
   dispatch(getAllUsers());
  }, [dispatch]);

  const users = useSelector((state) => state.auth.users || []);

  const handleDelete = (id) => {
    if (
      window.confirm(
        translateMode
          ? 'Are you sure to delete this office?'
          : 'هل أنت متأكد من حذف هذا المكتب؟'
      )
    ) {
      dispatch(deleteOffice(id)).then((res) => {
        if (!res.error) {
          dispatch(getAllUsers());
        }
      });
    }
  };

  const handleDetails = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className={`admin-dashboard ${translateMode ? 'en' : 'ar'}`}>
      <Sidebar />
      <main className="main">
        <h2 className="page-title">{translateMode ? 'Office Management' : 'إدارة المكاتب'}</h2>
        <div className="office-grid">
          {users.map((user) => (
            <div className="office-card" key={user.id}>
              <div className="icon-box">
                <FaBuilding />
              </div>
              <h3>{user.name}</h3>
              <p className="address">{user.address}</p>
              <div className="contact">
                <p><FaPhone /> {user.phone}</p>
                <p><FaWhatsapp /> {user.whatsapp}</p>
              </div>
              <div className="actions">
                <button className="details-btn" onClick={() => handleDetails(user.id)}>
                  <FaInfoCircle /> {translateMode ? 'Details' : 'تفاصيل'}
                </button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                  <FaTrashAlt /> {translateMode ? 'Delete' : 'حذف'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OfficeManagement;
