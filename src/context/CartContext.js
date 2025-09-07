import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
} from "@/components/services/cart";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart items
  useEffect(() => {
    if (!token) return;
    const getCartItems = async () => {
      getCart(token)
        .then((data) => {
          setCart(data?.items);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    getCartItems();
  }, [token]);

  // Add item to cart
  const addItemToCart = async (productId) => {
    setIsLoading(true);
    try {
      const response = await addToCart(productId, token).then((res) => {
        setCart(res.items);
      });
    } catch (error) {
      console.error("Failed to add item to cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItemFromCart = async (productId) => {
    setIsLoading(true);
    const previousCart = [...cart];

    setCart((prevItems) =>
      prevItems.filter((item) => item.product !== productId)
    );

    try {
      await removeFromCart(productId, token);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setCart(previousCart); // Rollback on failure
    } finally {
      setIsLoading(false);
    }
  };

  // update cart
  const updateQuantity = async (product_id, quantity) => {
    if (quantity < 1) return;

    const previousCart = [...cart];
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product === product_id ? { ...item, quantity } : item
      )
    );

    try {
      await updateCartItem(product_id, quantity, token);
    } catch (error) {
      console.error("Failed to update cart item:", error);
      setCart(previousCart); // Rollback on failure
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addItemToCart,
        updateQuantity,
        removeItemFromCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
