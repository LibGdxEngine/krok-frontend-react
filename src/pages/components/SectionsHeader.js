import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

export default function SectionsHeader() {
    const {t, i18n} = useTranslation("common");
    const router = useRouter();
    return (
        <div id="sections-header"
             className="w-full relative mt-2 flex flex-col lg:flex-row items-center justify-center px-4"
        >
            <div style={{cursor: "pointer"}} className="w-full sm:w-auto flex-1 rounded-lg px-5 py-1 text-white
             border border-0.5 border-lightDark mx-1 mb-2 sm:mb-0"
                 onClick={() => {
                     router.push('/');
                 }}>
                {t("Home")}
            </div>
            <div style={{cursor: "pointer"}}
                 onClick={() => {
                     router.push('/profile');
                 }}
                className="w-full sm:w-auto flex-1 rounded-lg px-5 py-1 text-white border border-0.5 border-lightDark mx-1 mb-2 sm:mb-0">
                {t("Profile")}
            </div>
            <div
                style={{cursor: "pointer"}}
                onClick={() => {
                    router.push('/start');
                }}
                className="w-full sm:w-auto flex-1 rounded-lg px-5 py-1 text-white border border-0.5 border-lightDark mx-1 mb-2 sm:mb-0 cursor-pointer"
            >
                {t("Quiz")}
            </div>
        </div>
    );
}
