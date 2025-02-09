// services/auth.js
import axiosInstance from "../axiosInstance";

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/v1/user/create/", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getToken = async (credentials) => {
  try {
    const response = await axiosInstance.post("/v1/user/token/", credentials);
    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

export const getUser = async (token) => {
  try {
    const response = await axiosInstance.get("/v1/profiles/me/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const socialAuth = async (provider, accessToken) => {
  try {
    const response = await axiosInstance.post("/v1/user/social-login-token/", {
      provider,
      access_token: accessToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

export const passwordReset = async (data) => {
  try {
    const response = await axiosInstance.post("/v1/user/password-reset/", data);
    return response.data;
  } catch (error) {
    console.error("Error sending password reset link:", error);
    throw error;
  }
};
