// Component.jsx
import {useTranslation} from "react-i18next";

const VideoPlayer = () => {
    const {t, i18n} = useTranslation("common");
    return <div id="home-video"
                className="w-full flex flex-col sm:w-screen  h-screen sm:h-80 items-center justify-center">
        <h1 className={`text-6xl sm:text-4xl mt-5 font-extrabold text-black`}>{t("HowToUse")}</h1>
        <div className=" w-full h-full  px-28 pb-10 pt-10 md:px-4">

            <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/CjcRacjsmYY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    </div>

};

export default VideoPlayer;
