import { useRouter } from 'next/router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import icon404 from '../../public/1.svg';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { addToCart } from '@/components/services/shop';
const Shop = () => {
  const router = useRouter();
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      addToCart(token, 1)
        .then((response) => {
          console.log('Product added to cart:', response);
        })
        .catch((error) => {
          console.error('Error adding product to cart:', error);
        });
    }
  }, [token]);

  return (
    <div className="w-full h-full">
      <NavBar />
      <div className='w-full h-screen flex flex-col items-center justify-center'>
        <Image src={icon404} alt='404' className='w-1/4' />
        <h1 className='text-6xl text-black mt-10'>Shop is closed now</h1>

        <button className='mt-10 text-blue-400' onClick={() => router.push("/")}>Go back to home</button>
      </div>
    </div>
  );

}

export default Shop;
