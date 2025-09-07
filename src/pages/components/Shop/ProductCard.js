import axiosInstance from "@/components/axiosInstance";
import { addToCart } from "@/components/services/cart";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCartContext } from "@/context/CartContext";

function ProductCard({ product, onClickAction }) {
  const product_id = product?.id;
  const notify = () => toast("Product added to cart!");
  const { token } = useAuth();
  const { addItemToCart } = useCartContext();
  const handleAddToCart = async () => {
    addItemToCart(product_id, token).then(() =>
      notify("Product added to cart!")
    );
  };

  return (
    <div className="group w-full max-w-sm aspect-[31/50] overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 flex flex-col">
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => {
          onClickAction();
        }}
      >
        <Image
          src={product.img || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover aspect-[2/2] transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        {/* Name + Description */}
        <div
          className="space-y-2 cursor-pointer flex-1"
          onClick={() => onClickAction()}
        >
          <h3 className="font-sans font-semibold text-xl text-gray-900 text-balance leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {product.description.substring(0, 200) +
              (product.description.length > 200 ? "..." : "")}
          </p>
        </div>

        {/* Price + Button (always pinned at bottom) */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-sans font-bold text-2xl text-midGreen">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => handleAddToCart()}
            className="bg-midGreen hover:bg-darkGreen text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
