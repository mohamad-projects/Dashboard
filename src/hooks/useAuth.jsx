import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const token = user ? user.token : null; // تحقق إذا كان user موجودًا قبل الوصول إلى token

    const isAuthenticated = !!token;

    const handleLogout = () => {
        dispatch(logout());
    };

    return {
        user,
        token,
        isAuthenticated,
        logout: handleLogout,
    };
};

export default useAuth;
