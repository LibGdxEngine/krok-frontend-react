import { useEffect, useState } from "react";
import { removeFromCart } from "../../../components/services/cart";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/components/axiosInstance";
import Image from "next/image";
import { useCartContext } from "@/context/CartContext";

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { cart, updateQuantity, removeItemFromCart } = useCartContext();
  const [couponCode, setCouponCode] = useState("");

  const subtotal = cart?.reduce(
    (total, item) => total + item.product_price * item.quantity,
    0
  );
  const itemCount = cart?.reduce((total, item) => total + item.quantity, 0);

  const applyCoupon = async (order_id) => {
    try {
      const response = await axiosInstance.post(
        "/v1/orders/apply-coupon/",
        {
          coupon_code: couponCode,
          order_id: order_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Coupon applied successfully:", response.data);
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const paymentCheckout = async (order_id) => {
    try {
      console.log("order_id", order_id);
      const response = await axiosInstance.post(
        "/v1/payments/create-checkout-session/",
        {
          order_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const { checkout_url } = response.data;
      window.location.href = checkout_url;
    } catch (error) {
      console.error("Error during payment checkout:", error);
    }
  };

  const makeOrder = async () => {
    try {
      const response = await axiosInstance.post(
        "/v1/orders/create/",
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const orderId = response.data.id;
      console.log("order_id", orderId);

      await applyCoupon(orderId);
      await paymentCheckout(orderId);
    } catch (error) {
      console.error("Error in makeOrder:", error);
    }
  };

  if (loading) {
    <p>Loading...</p>;
  }
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Cart Button */}
      <button
        className="relative p-3 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
            {itemCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-3/12 sm:w-96 text-black bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart ({itemCount})</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
          {cart?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500">Your cart is empty</p>
              <button
                className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart?.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 border-b">
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    
                    <Image
                      src={item?.product?.img ? `https://krokplus.com${item?.product_img}` : "/placeholder.svg"}
                      alt={item?.product_name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.product_name}</h3>
                      <button
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => {
                          removeItemFromCart(item.product);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      ${item.product_price}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-2 py-1 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.product, item.quantity - 1)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="px-2 py-1 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.product, item.quantity + 1)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="font-medium">
                        ${(item.product_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart?.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            {/* Apply Coupon Section */}
            <div className="mb-4">
              <label
                htmlFor="coupon"
                className="block text-sm font-medium text-gray-500"
              >
                Apply Coupon
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  id="coupon"
                  placeholder="Enter coupon code"
                  className="w-full p-2 border rounded-md "
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              className="w-full py-2 bg-navyBlue text-white rounded-md hover:bg-blue-500 transition"
              onClick={() => makeOrder()}
            >
              Checkout
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
}
