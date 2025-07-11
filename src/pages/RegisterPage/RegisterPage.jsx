import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerAdmin } from '../../features/auth/authSlice';
import './RegisterPage.scss';

const RegisterAdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (error) {
      if (error.errors) {
        const firstKey = Object.keys(error.errors)[0];
        setLocalError(error.errors[firstKey][0]);
      } else {
        setLocalError(error.message || 'Unknown error.');
      }
    } else {
      setLocalError(null);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    form.append('role', 1); // ✅ نحدد أن المستخدم هو أدمن

    const resultAction = await dispatch(registerAdmin({ formData: form, token }));

    if (registerAdmin.fulfilled.match(resultAction)) {
      setSuccessMessage('تم تسجيل الأدمن بنجاح!');
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/dashboard'), 2000); // أو أي صفحة أخرى
    }
  };

  return (
    <div className="register-admin-page">
      <div className="register-container">
        <h2>تسجيل أدمن جديد</h2>

        {successMessage && <div className="success">{successMessage}</div>}
        {localError && <div className="error">{localError}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="الاسم"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'جاري التسجيل...' : 'تسجيل أدمن'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdminPage;
