import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/auth/authSlice";
import { FaTelegramPlane } from "react-icons/fa";
import "./Register.scss";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    city: "",
    district: "",
    phone_no: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await dispatch(register(formData));
    if (response.payload && response.payload.token) {
      navigate("/next-page");
    } else {
      console.log("Error in registration:", response.payload);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-box">
          <h1>Create Account</h1>
          <p>Join HomeFinder now</p>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </div>
            <div className="form-group icon-input">
              <label>Telegram Username</label>
              <div className="input-icon">
                <FaTelegramPlane className="icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                placeholder="Phone Number"
                inputMode="numeric"
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <select name="city" value={formData.city} onChange={handleChange}>
                <option value="">Select City</option>
                <option value="Damascus">Damascus</option>
                <option value="Homs">Homs</option>
                <option value="Hama">Hama</option>
                <option value="Aleppo">Aleppo</option>
              </select>
            </div>
            <div className="form-group">
              <label>District</label>
              <select name="district" value={formData.district} onChange={handleChange}>
                <option value="">Select District</option>
                <option value="Bab Sarji">Bab Sarji</option>
                <option value="Air Messi">Air Messi</option>
                <option value="Hama">Hama</option>
                <option value="Aleppo">Aleppo</option>
              </select>
            </div>

            <div className="form-buttons">
              <button type="button" onClick={() => navigate(-1)} className="back">
                Back
              </button>
              <button type="submit" className="next">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
