// services/auth.js
import axiosInstance from '../axiosInstance';

export const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/user/create/', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const getToken = async (credentials) => {
    try {
        const response = await axiosInstance.post('/user/token/', credentials);
        return response.data;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};

export const getUser = async (token) => {
    try {
        const response = await axiosInstance.get('/profiles/me/', {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const socialAuth = async (provider, accessToken) => {
    try {
        const response = await axiosInstance.post('/user/social-login/', {
            provider,
            access_token: accessToken,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};