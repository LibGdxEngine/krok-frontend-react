// services/auth.js
import axiosInstance from "../axiosInstance";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/v1/user/signup/", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getToken = async (credentials) => {
  try {
    const response = await axiosInstance.post("/v1/user/login/", credentials);
    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};


export const activateAccount = async () => {
  try {
    const response = await axiosInstance.get("/v1/user/activate/");
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

export const passwordResetVerify = async (data) => {
  try {
    const response = await axiosInstance.post("/v1/user/password-reset-verify/", data);
    return response.data;
  } catch (error) {
    console.error("Error sending password reset link:", error);
    throw error;
  }
};

