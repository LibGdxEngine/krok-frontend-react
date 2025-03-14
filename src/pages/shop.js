import NavBar from './components/NavBar';
import { useState } from 'react';
import Pagination from './components/Shop/Pagination';
import ProductCard from './components/Shop/ProductCard';
import { ToastContainer } from 'react-toastify';
import ChatWidget from './components/Shop/MessageWidget';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useEffect } from "react";

const products = [
  {
    title:"Product 1",
    price: "100",
    author: "Author 1",
    inStock: true,
    genre: "medical",
    coverImage: "/1.svg",
    discountedPrice: "$150",
    sale: true,
  },
  {
    title:"Product 2",
    price: "200",
    author: "Author 2",
    inStock: false,
    genre: "medical",
    coverImage: "/2.svg",
    discountedPrice: "$250",
    sale: false,
  },
  {
    title: "Product 3",
    price: "300",
    author: "Author 3",
    inStock: true,
    genre: "fiction",
    coverImage: "/3.svg",
    discountedPrice: "$350",
    sale: true,
  },
  {
    title: "Product 4",
    price: "400",
    author: "Author 4",
    inStock: false,
    genre: "non-fiction",
    coverImage: "/4.svg",
    discountedPrice: "$450",
    sale: false,
  }
]

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const options=["Option 1", "Option 2", "Option 3"]
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

    return (
      <div className="w-full h-full">
        <NavBar />
        <div className="relative ml-auto m-10 w-40" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-gray-700 px-4 py-2 rounded-lg border transition-all"
      >
        {selected ? selected : "Sort by"}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg overflow-hidden animate-slide-down">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer transition"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
            <div
                className="grid grid-cols-4 gap-x-10 gap-y-16 w-[90%] mx-auto mt-10 lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1">
                {loading ? (
                    <p>Loading</p>
                ) : (
                    products.map((product, index) => (
                        <ProductCard book={product} key={index} />
                    ))
                )}
            </div>
            <Pagination products={products} />
            <ToastContainer />
            <ChatWidget />
      </div>
    );

}



export default Shop;
