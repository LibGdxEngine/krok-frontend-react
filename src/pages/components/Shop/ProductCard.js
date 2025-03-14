import Image from "next/image";
import { toast } from 'react-toastify';


const ProductCard = ({book}) => {

    const notify = () => toast("Product added to cart!");

    const handleAddToCart = () => {
        notify();
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200">
        <div className="relative h-[300px] bg-gray-100">
          <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
        </div>
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-2">
            <div className='flex flex-col gap-y-2'>
            <h3 className="font-semibold text-lg line-clamp-2 text-black">{book.title}</h3>
            <p className="text-gray-600 mb-2">{book.author}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${book.inStock ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {book.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <span className="text-black text-xs px-2 py-1 rounded-full border border-gray-300 inline-block mb-4">{book.genre}</span>
            </div>
          </div>
            <p className="text-center font-bold text-lg text-black">${book.price}</p>
        </div>
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            disabled={!book.inStock}
            className={`w-full py-2 px-4 rounded-md ${
              book.inStock ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition-colors`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    )
  };

  export default ProductCard;