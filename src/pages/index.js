import HomePage from "@/pages/components/Home/HomePage";
import HomeFAQs from "@/pages/components/Home/HomeFAQs";
import TopStudentsThisMonth from "@/pages/components/Home/TopStudentsThisMonth";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/pages/components/utils/VideoPlayer";
import { useEffect, useState } from "react";

import {
    getHomeData,
} from "@/components/services/questions";
import { useTranslation } from 'react-i18next';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const Home = () => {
    const searchParams = useSearchParams();
    const emailActivated = searchParams.get('activated');
    const emailMessage = searchParams.get('message');
    const router = useRouter();
    const [faqs, setFaqs] = useState([]);
    const [video, setVideo] = useState(null);
    useEffect(() => {
        getHomeData().then((data) => {
            setFaqs(data.faqs);
            setVideo(data.video_url);
        });
    }, []);


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
       
          {/* Add the leaderboard section */}
          <TopStudentsThisMonth maxStudents={10} /> {/* Show top 10 */}

          <div >
            <br />
          </div>
          <div className={`w-full h-full`}>
            <VideoPlayer videoUrl={video} />
          </div>

          <div className={`block bg-white w-full h-full z-20`}>
            <HomeFAQs faqs={faqs} />
          </div>

          <div className="w-full mt-14">
            <Footer />
          </div>
        </div>}
        
      </>
    );
}

export default Home;