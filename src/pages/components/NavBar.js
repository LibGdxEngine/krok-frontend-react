import Image from "next/image";
import logo from "../../../public/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import user from "../../../public/profile.svg";
import LanguageDropdown from "@/pages/components/utils/LanguageDropdown";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const NavBar = () => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const { token } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push({
        pathname: "/search",
        query: { token: inputValue.trim() },
      });
    }
  };
  return (
    <div
      id={`navbar`}
      className={`w-full h-20 flex md:hidden items-center justify-between navbar ps-20 py-2`}
      style={{ position: "fixed", zIndex: "99" }}
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
      <div
        className={`w-full flex flex-row items-center mx-4`}
        style={{ justifyContent: "space-evenly" }}
      >
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => {
            router.push("/home");
          }}
          className={`text-xl text-white ms-1 `}
        >
          Home
        </div>
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          className={`text-xl text-white ms-10 `}
        >
          Material
        </div>

        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => {
            router.push("/start");
          }}
          className={`text-xl text-white ms-1 line-clamp-1`}
        >
          Generate Quiz
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
            className="w-full h-full bg-white py-2 focus:border-lightDark outline-none rounded-full px-2 ps-12"
          />
          <FontAwesomeIcon
            className="absolute p-1 left-8 top-[28%] -translate-x-[50%]"
            icon={faSearch}
            style={{ color: "#0073D1" }}
          />
        </div>
        {inputValue && (
          <button
            type="submit"
            className="absolute right-7 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded-full"
          >
            Search
          </button>
        )}
      </form>

      <div className={`w-fit flex items-end justify-end ps-10 z-100`}>
        <LanguageDropdown />
      </div>

      <div
        style={{ cursor: "pointer", width: "40%" }}
        onClick={() => {
          router.push("/profile");
        }}
        id={`profile-icon-container`}
        className={`w-full flex items-center justify-end `}
      >
        <div className={`flex flex-col`}>
          {token ? (
            <>
              <div className={`text-xs text-black`}>Hello, User</div>
              <div className={`text-sm text-black`}>Welcome Back!</div>
            </>
          ) : (
            <div>
              <div className={`text-sm text-black`}>Authentication</div>
            </div>
          )}
        </div>
        <Image
          width={35}
          height={35}
          src={user}
          alt={`profile`}
          objectFit={`cover`}
          className={`w-10 h-10 rounded-full me-2`}
        />
      </div>
    </div>
  );
};

export default NavBar;
