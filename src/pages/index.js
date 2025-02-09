import HomePage from "@/pages/components/Home/HomePage";
import HomeFAQs from "@/pages/components/Home/HomeFAQs";
import Footer from "@/pages/components/Footer";
import VideoPlayer from "@/pages/components/utils/VideoPlayer";
import { useTranslation } from 'react-i18next';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const Home = () => {
    const searchParams = useSearchParams();
    const emailActivated = searchParams.get('activated');
    const emailMessage = searchParams.get('message');
    const router = useRouter();
    const redirectFunction = () => {
      setTimeout(() => {
        if(emailActivated === 'true'){
          router.push('/signin');
        }else{
          router.push('/');
        }
      }, 3000);
    }
    if(emailMessage){
      redirectFunction();
    }
    return (
      <>
        {emailMessage?<div className="h-screen w-full bg-white flex justify-center items-center">
          {emailActivated === 'true'  &&<h3 className="text-green-500 text-[44px] font-semibold">
            {emailMessage} ✅
          </h3>}
          {emailActivated === 'false' && <h3 className="text-red-500 text-[44px] font-semibold">
            {emailMessage} ❌
          </h3>}
        </div>:<div
          id={`main-container`}
          className={`w-full bg-light h-full flex flex-col items-center justify-start`}
        >
          <HomePage />
          <br />
          <br />
          <div >
            <br />
          </div>
          <div className={`w-full h-full`}>
            <VideoPlayer />
          </div>

          <div className={`block bg-white w-full h-full z-20`}>
            <HomeFAQs />
          </div>

          <div className="w-full mt-14">
            <Footer />
          </div>
        </div>}
        
      </>
    );
}

export default Home;