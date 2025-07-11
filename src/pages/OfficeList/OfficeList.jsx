import React, { useState } from 'react';
import {
  FaChartBar, FaBuilding, FaHome, FaWrench, FaUsers, FaSignOutAlt, FaSearch,
  FaWhatsapp, FaTelegram, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaPhone
} from 'react-icons/fa';
import Sidebar from '../../components/SideBar/SideBar';
import './OfficeList.scss';

const menuItems = [
  { icon: <FaChartBar />, label: 'Dashboard' },
  { icon: <FaBuilding />, label: 'Offices' },
  { icon: <FaHome />, label: 'Properties' },
  { icon: <FaWrench />, label: 'Services' },
  { icon: <FaUsers />, label: 'Users' },
  { icon: <FaSignOutAlt />, label: 'Logout' },
];

const initialOffices = [
  {
    id: 1,
    name: 'مكتب الحياة العقاري',
    nameEn: 'Al-Hayat Real Estate',
    address: 'دمشق - المالكي - قرب حديقة الأجهزة',
    addressEn: 'Damascus - Malki - Near Ajahez Park',
    phone: '+963 944 123 456',
    whatsapp: '963949221604',
    telegram: 'tofick_babbily',
    subscribed: true,
    propertiesCount: 12,
  },
  {
    id: 2,
    name: 'مكتب النخبة العقاري',
    nameEn: 'Elite Real Estate',
    address: 'حمص - شارع الحضارة',
    addressEn: 'Homs - Civilization Street',
    phone: '+963 944 987 654',
    whatsapp: '963949221604',
    telegram: 'tofick_babbily',
    subscribed: false,
    propertiesCount: 0,
  },
  {
    id: 3,
    name: 'مكتب المستقبل العقاري',
    nameEn: 'Future Real Estate',
    address: 'حلب - سيف الدولة',
    addressEn: 'Aleppo - Saif Al-Dawla',
    phone: '+963 933 321 999',
    whatsapp: '963949221604',
    telegram: 'tofick_babbily',
    subscribed: true,
    propertiesCount: 7,
  }
];

const OfficeList = () => {
  const [offices, setOffices] = useState(initialOffices);

  const toggleSubscription = (id) => {
    setOffices(prev =>
      prev.map(office =>
        office.id === id ? { ...office, subscribed: !office.subscribed } : office
      )
    );
  };

  return (
    <div className="admin-dashboard">
   
<Sidebar/>
      <main className="main-offices">
        <h1 className="page-title-offices">المكاتب العقارية</h1>
        <div className="office-cards-wrapper-offices">
          {offices.map((office) => (
            <div key={office.id} className={`office-card-offices ${office.subscribed ? 'active' : 'inactive'}`}>
              <div className="office-info">
                <h2>{office.name}</h2>
                <p><FaMapMarkerAlt /> {office.address}</p>
                <p><FaPhone /> {office.phone}</p>
                {office.subscribed && (
                  <p className="property-count-offices">عدد العقارات المنشورة: <strong>{office.propertiesCount}</strong></p>
                )}
              </div>
              <div className="actions-offices">
                <button className="subscription-btn-offices" onClick={() => toggleSubscription(office.id)}>
                  {office.subscribed ? (
                    <>
                      <FaCheckCircle /> مشترك
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> غير مشترك
                    </>
                  )}
                </button>
                <a href={`https://wa.me/${office.whatsapp}`} target="_blank" className="whatsapp" rel="noreferrer">
                  <FaWhatsapp /> واتساب
                </a>
                <a href={`https://t.me/${office.telegram}`} target="_blank" className="telegram" rel="noreferrer">
                  <FaTelegram /> تيليغرام
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OfficeList;
