import React from "react";
import NavBar from "./components/NavBar";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation("common");

  const router = useRouter();

  return (
    <div className="w-full h-full">
      <NavBar />

      <div className="w-full h-screen items-center text-black bg-white">
        <p className="p-4 bg-white">{t("privacy")}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
