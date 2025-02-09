import Image from "next/image";
import app1 from "../../../public/GetItOnGooglePlay_Badge_Web_color_English.png";
import app2 from "../../../public/Download_on_the_App_Store_Badge_US-UK_RGB_wht_092917.svg";
import facebook from "../../../public/FB.svg";
import insta from "../../../public/Insta.svg";
import YT from "../../../public/YT.svg";
import telegram from "../../../public/BG-svg (1).svg";
import {useTranslation} from "react-i18next";
import LanguageDropdown from "@/pages/components/utils/LanguageDropdown";

function Footer() {
    const {t, i18n} = useTranslation("common");
    return (
      <>
        <div
          id={`footer `}
          className={`bg-navyBlue w-full h-fit py-4  z-20 flex sm:flex-col sm:justify-center items-center justify-between`}
        >
          <div className="w-full flex flex-col  justify-center items-start sm:items-center ">
            <div className=" text-white font-bold ps-10 sm:ps-0 mb-2 sm:mb-0">
              {t("GETAPP")}
            </div>
            <div className={`w-full flex sm:mt-2 items-center justify-start md:justify-center`}>
              <Image
                className={`me-8 sm:me-4 ms-10 sm:ms-0`}
                src={app1}
                alt={``}
                width={135}
                height={135}
              />
              <Image src={app2} alt={``} width={135} height={135} />
            </div>
          </div>
          <div
            className={`w-fit  bg-white rounded-xl items-end justify-end mx-10 hidden sm:flex mt-2`}
          >
            <LanguageDropdown />
          </div>
          <div className="w-56 flex flex-col items-center justify-center mx-20 sm:mx-0">
            <div className="w-56 sm:text-center text-white  font-base mb-2 px-4">{t("FOLLOWUS")}</div>
            <div
              className={`w-fit  h-full flex items-center justify-center `}
            >
              <Image
                src={telegram}
                alt="Telegram Icon"
                width={49}
                height={49}
                className="object-contain mx-1"
              />
              <Image
                className={`mx-1`}
                src={facebook}
                alt={``}
                width={49}
                height={49}
              />
              <Image
                className={`mx-1`}
                src={insta}
                alt={``}
                width={49}
                height={49}
              />
              <Image
                className={`mx-1`}
                src={YT}
                alt={``}
                width={49}
                height={49}
              />
            </div>
          </div>
        </div>
        <div
          className={`w-full h-10 bg-darkBlue text-center
             text-white text-xs flex items-center justify-center`}
        >
          {t("AllRights")} - KROK PLUS
        </div>
      </>
    );
}

export default Footer;