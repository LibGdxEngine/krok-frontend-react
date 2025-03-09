import Image from "next/image";
import logo from "../../../public/logo.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import userIcon from "../../../public/profile.svg";
import LanguageDropdown from "@/pages/components/utils/LanguageDropdown";
import {useRouter} from "next/router";
import {useAuth} from "@/context/AuthContext";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const NavBar = () => {
    const {t, i18n} = useTranslation("common");
    const [inputValue, setInputValue] = useState('');
    const router = useRouter();
    const isActive = (path) => router.pathname === path;
    const {token, user} = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputValue.trim());
        
        if (inputValue.trim()) {
          console.log(inputValue.trim());
          
            router.push({
                pathname: '/search',
                query: {query: inputValue.trim()}
            });
        }
    };
    let userProfilePhoto = userIcon;
    if (user) {
        userProfilePhoto = user.profile_photo?.toString().length <= 50 ? userIcon : user.profile_photo;
    }

    return (
      <div className={`w-full h-20 sm:h-4 z-100 lg:hidden`}>
        <div
          id={`navbar`}
          className={`w-full fixed h-20 flex items-center justify-between navbar ps-10 lg:ps-2 py-2 z-40`}
        >
          <Image
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/");
            }}
            src={logo}
            alt={``}
            width={50}
            height={50}
          />

          <div className="w-full flex flex-row items-center justify-between px-20 xl:px-4  ">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.replace("/");
              }}
              className={`text-base font-bold lg:text-xs lg group relative ${
                isActive("/") ? "text-gray-300" : "text-white"
              }`}
            >
              {t("Home")}
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  isActive("/") ? "scale-x-100" : ""
                }`}
              ></div>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.replace("/shop");
              }}
              className={`text-base font-bold lg:text-xs group relative ${
                isActive("/shop") ? "text-gray-300" : "text-white"
              }`}
            >
              {t("shop")}
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  isActive("/material") ? "scale-x-100" : ""
                }`}
              ></div>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push("/start");
              }}
              className={`text-base font-bold lg:text-xs  line-clamp-1 group relative ${
                isActive("/start") ? "text-gray-300" : "text-white"
              }`}
            >
              {t("GenerateQuiz")}
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  isActive("/start") ? "scale-x-100" : ""
                }`}
              ></div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full h-[49px] relative px-5 mt-2"
          >
            <div id="search-bar" className="w-full h-full relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-full bg-white text-black py-2 focus:border-lightDark outline-none rounded-full lg:text-xs px-2 ps-12"
                placeholder={`${t("Search")} ....`}
              />
                <FontAwesomeIcon
                    className="absolute p-1 left-8 top-[28%] -translate-x-[50%] text-blue-600"
                    icon={faSearch}
                    style={{ fontSize: "16px", width: "16px", height: "16px" }} // Set a fixed size
                />

            </div>
            {inputValue && (
              <button
                type="submit"
                className="absolute right-7 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded-full"
              >
                {t("Search")}
              </button>
            )}
          </form>

          <div className={`w-fit flex items-end justify-end mx-10 z-100`}>
            <LanguageDropdown />
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/profile");
            }}
            id={`profile-icon-container`}
            className={`w-full lg:mx-2 flex items-center justify-end pe-10`}
          >
            <Image
              width={35}
              height={35}
              src={userProfilePhoto}
              alt={`profile`}
              objectFit={`cover`}
              className={`w-10 lg:w-32 h-10 rounded-full me-2`}
            />
            <div className={`flex flex-col`}>
              {token ? (
                <div className="lg:w-32">
                  <div className={`text-xs text-black`}>
                    {t("Hello")}, {user?.first_name}
                  </div>
                  {/* <div className={`text-sm text-black`}>{t("Welcome")}</div> */}
                </div>
              ) : (
                <div>
                  <div className={`text-sm text-black`}>{t("SignIn")}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    );
}

export default NavBar;