import { useState, useContext } from 'react'; // Import useContext
import './Complaints.scss';
import Sidebar from '../../components/SideBar/SideBar';
import { DarkModeContext } from '../../context/DarkModeContext'; // Import DarkModeContext
import { FaInbox, FaUser, FaPhone, FaCommentAlt, FaHourglassHalf, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icons

const dummyComplaints = [
  { id: 1, name: 'Ali Hassan', phone: '0987654321', complaint: 'There’s a bug in the property page.', status: 'pending' },
  { id: 2, name: 'Lina Ahmad', phone: '0933224567', complaint: 'Unable to contact office.', status: 'pending' },
  { id: 3, name: 'Mohammed Said', phone: '0912345678', complaint: 'Office contact details are incorrect.', status: 'resolved' },
  { id: 4, name: 'Fatima Omar', phone: '0998765432', complaint: 'Property images are not loading.', status: 'pending' },
];

const Complaints = () => {
  const [complaints, setComplaints] = useState(dummyComplaints);
  const { translateMode } = useContext(DarkModeContext); // Use translateMode from context

  const handleResolve = (id) => {
    setComplaints(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'resolved' } : c))
    );
  };

  const t = {
    pageTitle: translateMode ? 'User Complaints' : ' Inbox شكاوى المستخدمين',
    nameHeader: translateMode ? 'Name' : 'الاسم',
    phoneHeader: translateMode ? 'Phone' : 'الهاتف',
    complaintHeader: translateMode ? 'Complaint' : 'الشكوى',
    statusHeader: translateMode ? 'Status' : 'الحالة',
    actionHeader: translateMode ? 'Action' : 'الإجراء',
    resolvedStatus: translateMode ? 'Resolved' : 'تم الحل',
    pendingStatus: translateMode ? 'Pending' : 'قيد الانتظار',
    markAsResolved: translateMode ? 'Mark as Resolved' : 'وضع علامة تم الحل',
    done: translateMode ? 'Done' : 'تم',
  };

  return (
    <div className={`admin-dashboard ${translateMode ? 'ltr' : 'rtl'}`}>
      <Sidebar />
      <main className="main complaints-main">
        <h2 className="complaints-title">
          <FaInbox className="title-icon" /> {t.pageTitle}
        </h2>

        <div className="complaints-table">
          <div className="table-header">
            <span>{t.nameHeader}</span>
            <span>{t.phoneHeader}</span>
            <span>{t.complaintHeader}</span>
            <span>{t.statusHeader}</span>
            <span>{t.actionHeader}</span>
          </div>

          {complaints.map((c) => (
            <div key={c.id} className="table-row">
              <span><FaUser className="row-icon" /> {c.name}</span>
              <span><FaPhone className="row-icon" /> {c.phone}</span>
              <span><FaCommentAlt className="row-icon" /> {c.complaint}</span>
              <span className={c.status === 'resolved' ? 'resolved-status' : 'pending-status'}>
                {c.status === 'resolved' ? <><FaCheckCircle className="status-icon" /> {t.resolvedStatus}</> : <><FaHourglassHalf className="status-icon" /> {t.pendingStatus}</>}
              </span>
              <span>
                <button
                  className="resolve-btn"
                  disabled={c.status === 'resolved'}
                  onClick={() => handleResolve(c.id)}
                >
                  {c.status === 'resolved' ? t.done : t.markAsResolved}
                </button>
              </span>
            </div>
          ))}

          {complaints.length === 0 && (
            <div className="no-complaints-message">
              <FaExclamationCircle className="no-data-icon" /> {translateMode ? 'No complaints to display.' : 'لا توجد شكاوى لعرضها.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Complaints;