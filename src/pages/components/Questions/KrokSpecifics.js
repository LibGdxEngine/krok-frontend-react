import React from 'react';
import Link from 'next/link';
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

const KrokSpecifics = () => {
    const {t, i18n} = useTranslation("common");
    const router = useRouter();
    return (
        <div className={`w-full`}>
            <h1 className="text-5xl font-bold text-blue-600 mb-4">{t("PleaseChoose")}</h1>
            <div onClick={() => {
                router.back();
            }} className="flex items-center text-green-500">
                <div style={{cursor: "pointer"}} className="text-2xl hover:underline">{t("GoBackFilter")}</div>
            </div>
        </div>
    );
};

export default KrokSpecifics;
