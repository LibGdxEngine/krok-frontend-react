import Image from "next/image";
import sliderImage from "../../../../public/sliderImage.svg";
import arrowDown from "../../../../public/arrowdown2.svg";
import homeBackground from "../../../../public/home_background.svg";
import actionButton from "../../../../public/Button Primary Color.svg";
import homeImg from "../../../../public/home_img.svg";
import logo from "../../../../public/logo.svg";
import TopBar from "@/pages/components/Home/TopBar";
import SearchBar from "@/pages/components/Home/SearchBar";
import {useState} from "react";
import searchIcon from "../../../../public/searchIcon.svg";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import user from "../../../../public/profile.svg";
import LanguageDropdown from "@/pages/components/utils/LanguageDropdown";
import HomeFAQs from "@/pages/components/Home/HomeFAQs";
import {useRouter} from "next/router";
import NavBar from "@/pages/components/NavBar";
import FlowingIcons from "@/pages/components/utils/FlowingIcons";
import SectionsHeader from "@/pages/components/SectionsHeader";
import VideoPlayer from "@/pages/components/utils/VideoPlayer";


function HomeSlider() {
    return <div id={`home-slider`} className={`w-full h-fit px-4 mt-4`}>
        <Image src={sliderImage} width={750} height={650} alt={``}/>
    </div>;
}


function HomePage() {
    const router = useRouter();
    function handleStart() {
        router.push('/start')
    }

    return <div id={`home-container`} className={`w-full h-full`}>

        <div className="hidden lg:block">
            <SearchBar/>
            <SectionsHeader/>
            <HomeSlider/>
            <br/>
            <VideoPlayer/>
            <br/>
            <HomeFAQs/>
        </div>
        <div className="block lg:hidden relative">

            <NavBar/>

            <Image className={`absolute bg-cover`} src={homeBackground} alt={``} width={1500} height={1500}/>

            <div className="h-screen flex items-end justify-center relative">
                <div style={{zIndex: "-100"}} className={`w-full min-h-screen absolute z-[-1] mt-20`}>
                    <FlowingIcons/>
                </div>
                <div className="h-full  flex flex-col items-center justify-center w-full">

                    <div className={`w-full px-28 h-full flex flex-col justify-between pb-28 pt-6`}>
                        <div style={{fontSize: "128px", fontWeight: "700"}}
                             className={`text-white text-opacity-40 font-extrabold`}>
                            KROK PLUS
                            <div className="border-t border-2 border-white border-opacity-25 mb-8"></div>
                        </div>


                        <div style={{fontSize: "60.45px"}} className={`text-white font-bold text-5xl`}>
                        Get Motivated In Minutes
                        </div>
                        <div style={{fontSize: "50.45px", lineHeight: "50px"}}  className={`text-white mt-4 font-semibold text-4xl`}>
                            “The earlier you start working on something, the earlier you will see results.”
                        </div>
                        <div className={`text-white font-base text-2xl mt-4`}>
                            “Every morning you have two choices: continue to sleep with your dreams, or wake up and
                            chase
                            them.”
                        </div>
                        <div style={{cursor: "pointer"}} onClick={handleStart} className={`w-96 mt-4`}>
                            <Image src={actionButton} alt={``} width={500} height={500}/>
                        </div>
                    </div>
                </div>
                <div>
                    <Image className={`h-full w-full py-20 px-20`} src={homeImg} alt={``} height={500} width={500}/>
                </div>
            </div>

        </div>

    </div>;
}

export default HomePage;