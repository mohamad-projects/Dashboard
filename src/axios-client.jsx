import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

axiosClient.defaults.headers.post['Accept'] = 'application/json';
axiosClient.defaults.headers.get['Accept'] = 'application/json';
axiosClient.defaults.headers.post['Content-Type'] = 'application/json';
axiosClient.defaults.headers.get['Content-Type'] = 'application/json';
axiosClient.defaults.withCredentials = true;

export const setAuthToken = (token) => {
    if (token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosClient.defaults.headers.common['Authorization'];
    }
};

export default axiosClient;
