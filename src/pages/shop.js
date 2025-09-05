import NavBar from "./components/NavBar";
import { useState } from "react";
import Image from "next/image";
import Pagination from "./components/Shop/Pagination";
import ProductCard from "./components/Shop/ProductCard";
import { ToastContainer } from "react-toastify";
import CartSidebar from "./components/cart/CartSidebar";
import ChatWidget from "./components/Shop/MessageWidget";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useEffect } from "react";
import SplashScreen from "@/components/common/SplashScreen";
import axiosInstance from "@/components/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useCartContext } from "@/context/CartContext";
import { ShoppingCart, X } from "lucide-react";

function ProductModal({ onClose, product, addToCart }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 200; // character limit

  const shouldTruncate = product.description.length > limit;
  const displayText = isExpanded
    ? product.description
    : product.description.substring(0, limit) + (shouldTruncate ? "..." : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-black" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2"></div>
            <h2 className="text-2xl font-bold text-black text-balance">
              {product.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-1 grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="aspect-[1/1] bg-black rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.img || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                {/* Price */}
                <div className="text-3xl font-bold text-primary">
                  ${product.price}
                </div>

                {/* Description */}
                <div>
                  <p className="text-black leading-relaxed">{displayText}</p>

                  {shouldTruncate && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-blue-600 hover:underline text-sm mt-1"
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-6 space-y-3">
                <button
                  className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                  size="lg"
                  onClick={() => {
                    addToCart(product.id);
                    onClose();
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Shop = () => {
  const notify = () => toast("Product added to cart!");
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = ["Option 1", "Option 2", "Option 3"];
  const [selected, setSelected] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const dropdownRef = useRef(null);

  const { addItemToCart } = useCartContext();

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

  const handleAddToCart = async (product_id, token) => {
    addItemToCart(product_id, token).then(() =>
      notify("Product added to cart!")
    );
  };

  return (
    <div className="w-full min-h-screen">
      <NavBar />
      <div className="grid grid-cols-4 gap-x-10 gap-y-16 w-[90%] mx-auto mt-10 lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1">
        {loading ? (
          <p>Loading</p>
        ) : (
          products.map((product, index) => {
            console.log("Product:", product);
            return (
              <div key={index}>
                <ProductCard
                  product={product}
                  key={index}
                  onClickAction={() => setSelectedProduct(product)}
                />

                {selectedProduct && (
                  <ProductModal
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    product={selectedProduct}
                    addToCart={handleAddToCart}
                  />
                )}
              </div>
            );
          })
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
