import axiosInstance from "@/components/axiosInstance";
import { addToCart } from "@/components/services/cart";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCartContext } from "@/context/CartContext";

const ProductCard = ({ product , onClick}) => {
  const notify = () => toast("Product added to cart!");
  const product_id = product?.id;
  const { token } = useAuth();
  const { addItemToCart } = useCartContext();
  const handleAddToCart = async () => {
    addItemToCart(product_id, token).then(() =>
      notify("Product added to cart!")
    );
  };


  return (
    <div onClick={onClick} key={0} className="border rounded-lg p-4 space-y-2">
      <div className="relative h-[300px] bg-gray-100">
        <Image
          src={product?.img ? `https://krokplus.com${product?.img}` : '/placeholder.svg'}
          alt={product?.name}
          fill
          style={{cursor: "pointer"}}
          className="object-cover"
        />
      </div>
      <h2 className="font-medium text-black">{product?.name}</h2>
      <p className="text-gray-500">{product?.description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-black">${product?.price}</span>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
