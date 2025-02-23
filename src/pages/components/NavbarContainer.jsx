import React from "react";
import NavBar from "./NavBar";
import Image from "next/image";
import SearchBar from "./Home/SearchBar";
import SectionsHeader from "./SectionsHeader";
import { useAuth } from "@/context/AuthContext";
import userIcon from "../../../public/profile.svg";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";
const NavbarContainer = () => {
  const { token, user } = useAuth();
  const {t, i18n} = useTranslation("common");
  let userProfilePhoto = userIcon;
  const router = useRouter();
  if (user) {
    userProfilePhoto =
      user.profile_photo? .toString().length <= 50
        ? userIcon
        : user.profile_photo;
  }
  return (
    <div className="w-full">
      <div className="lg:hidden">
        <NavBar />
      </div>
      <div className="hidden lg:block bg-[url('/home_background.svg')] w-full pt-4 pb-4">
        <div className="pt-4 mb-0  bg-cover ">
          <div
            className={`w-full h-full flex items-center justify-between px-4 mt-1`}
          >
            <div>
              <Link
                style={{ cursor: "pointer" }}
                href={token ?`/profile`: `/signin`}
                id={`profile-icon-container`}
                className={`w-full  flex items-center justify-end pe-10`}
              >
                <Image
                  width={35}
                  height={35}
                  src={userProfilePhoto}
                  alt={`profile`}
                  objectFit={`cover`}
                  className={`w-10 h-10 rounded-full me-2`}
                />
                <div className={`flex flex-col`}>
                  {token ? (
                    <>
                      <div className={`text-xs text-gray-200`}>
                        {t("Hello")}, {user?.first_name}
                      </div>
                      <div className={`text-sm text-gray-200`}>
                        {t("Welcome")}
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className={`text-sm text-gray-200`}>
                        {t("SignIn")}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
            <div>
              {/* <Image width={20} height={20} src={notificationsIcon} alt={`profile`} objectFit={`cover`}
                           className={`w-4 h-4 rounded-full m-2`}/> */}
            </div>
          </div>
          <SearchBar />
          <SectionsHeader />
        </div>
      </div>
    </div>
  );
};

export default NavbarContainer;
