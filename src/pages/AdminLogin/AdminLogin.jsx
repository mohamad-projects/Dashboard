// src/pages/AdminLogin/AdminLoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice'; // Import the login async thunk
import './AdminLogin.scss'; // Import SCSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';

const AdminLoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Select state from Redux store for loading, error, and token
    const { loading, error, token } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(null); // For local validation errors (e.g., empty fields)

    // Redirect if already logged in (based on Redux token state)
    useEffect(() => {
        if (token) {
            navigate('/dashboard'); // Navigate to your admin dashboard
        }
    }, [token, navigate]);

    // Listen for Redux error changes and set local error state for display
    useEffect(() => {
        if (error) {
            // Check if error.payload exists and has 'errors' for validation messages from backend
            if (error.errors) {
                // Take the first validation error message to display
                const firstErrorKey = Object.keys(error.errors)[0];
                setLocalError(error.errors[firstErrorKey][0]);
            } else {
                // If it's a general error message
                setLocalError(error.message || 'An unexpected error occurred during login.');
            }
        } else {
            setLocalError(null); // Clear local error if Redux error is cleared
        }
    }, [error]); // Dependency on the Redux `error` state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null); // Clear previous local validation errors

        // Basic client-side validation
        if (!email || !password) {
            setLocalError('Please enter both email and password.');
            return; // Stop the submission
        }

        // Dispatch the login async thunk with credentials
        // The resultAction contains the fulfilled or rejected payload/error
        const resultAction = await dispatch(login({ email, password }));

        // You can add specific post-dispatch logic here if needed
        // For example, if login.fulfilled returns specific data
        if (login.fulfilled.match(resultAction)) {
            console.log('Login action fulfilled, user and token should be in Redux state.');
        } else if (login.rejected.match(resultAction)) {
            console.error('Login action rejected:', resultAction.payload);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <h2 className="login-title">
                    <FontAwesomeIcon icon={faUserShield} className="title-icon" />
                    Admin Login
                </h2>

                {/* Display Error Messages (from local validation or Redux) */}
                {(localError) && ( // Display any local errors or errors from Redux
                    <div className="status-message error-message">
                        <FontAwesomeIcon icon={faLock} />
                        {localError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">
                            <FontAwesomeIcon icon={faEnvelope} />
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading} // Disable input during loading
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">
                            <FontAwesomeIcon icon={faLock} />
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading} // Disable input during loading
                        />
                    </div>
                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                Logging In...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faLock} />
                                Login
                            </>
                        )}
                    </button>
                </form>

                <div className="footer-links">
                    <a href="#">Forgot Password?</a>
                    <span>|</span>
                    <a href="#">Back to Website</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;