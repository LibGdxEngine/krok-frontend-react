import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

export const getCart = async (token) => {
  try {
    const response = await axiosInstance.get("/v1/cart/my_cart/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cart items", error);
  }
};

export const addToCart = async (productId, token) => {
  try {
    const response = await axiosInstance.post(
      "/v1/cart/add_item/",

      { product_id: productId },
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to add product to cart.");
  }
};

export const updateCartItem = async (product_id, quantity, token) => {
  try {
    const response = await axiosInstance.post(
      "/v1/cart/update_item/",

      { product_id: product_id, quantity: quantity },
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to update product in cart.");
  }
};

export const removeFromCart = async (productId, token) => {
  try {
    await axiosInstance.post(
      "/v1/cart/remove_item/",

      { product_id: productId },
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    toast.error("Failed to remove product from cart.");
  }
};

export const clearCart = async (token) => {
  try {
    await axiosInstance.post(
      "/v1/cart/clear_cart/",

      {},
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    toast.error("Failed to clear cart.");
  }
};
