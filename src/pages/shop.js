

import { useRouter } from 'next/router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import icon404 from '../../public/1.svg';
import Image from 'next/image';



const Shop = () => {

    const router = useRouter();


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
