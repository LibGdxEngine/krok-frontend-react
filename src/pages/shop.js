import NavBar from "./components/NavBar";
import { useState } from "react";
import Pagination from "./components/Shop/Pagination";
import ProductCard from "./components/Shop/ProductCard";
import { ToastContainer } from "react-toastify";
import { CartSidebar } from "./components/cart/CartSidebar";
import ChatWidget from "./components/Shop/MessageWidget";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useEffect } from "react";
import SplashScreen from "@/pages/components/SplashScreen";
import axiosInstance from "@/components/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const Shop = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = ["Option 1", "Option 2", "Option 3"];
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/v1/products/");
        setProducts(response.data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="w-full min-h-screen">
      <NavBar />
      <div className="relative ml-auto m-10 w-40" ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex justify-between items-center text-gray-700 px-4 py-2 rounded-lg border transition-all"
        >
          {selected ? selected : "Sort by"}
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg overflow-hidden animate-slide-down">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 text-gray-700 hover:bg-navyBlue hover:text-white cursor-pointer transition"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid grid-cols-4 gap-x-10 gap-y-16 w-[90%] mx-auto mt-10 lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1">
        {loading ? (
          <p>Loading</p>
        ) : (
          products.map((product, index) => (
            <ProductCard product={product} key={index} />
          ))
        )}
      </div>
      <Pagination products={products} />
      <ToastContainer />
      <ChatWidget />
      {token && <CartSidebar />}
    </div>
  );
};

export default Shop;
