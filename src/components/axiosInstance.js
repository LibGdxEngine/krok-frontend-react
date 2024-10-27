// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'https://app.krokplus.com/api',
    baseURL: 'https://3a70-45-242-115-138.ngrok-free.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


export default axiosInstance;
