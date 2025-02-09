import Image from "next/image";
import backBtnIcon from "../../../../public/mobile icons.svg";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

function StepBar({stepNumber = 1, onStepClicked}) {
    const {t, i18n} = useTranslation("common")
    const router = useRouter();
    const handleOnStepClicked = (step) => {
        if (onStepClicked) {
            onStepClicked(step)
        }
    }
    return <div className={`w-full flex flex-col items-start`}>
        <h1 className={`font-bold text-5xl text-ldarkBlue sm:text-sm`}>{t("PleaseChoose")}</h1>
        {/*<div onClick={()=>{*/}
        {/*    router.back();*/}
        {/*}} style={{cursor: "pointer"}} className={`flex flex-row items-center justify-center mt-2`}>*/}
        {/*    <Image src={backBtnIcon} alt={`back`} width={40} height={40}/>*/}
        {/*    <div style={{color: "#4DD4B2CC", fontWeight: "bold", fontSize: "22px"}}>Go back to previous filter ?</div>*/}
        {/*</div>*/}
        <div
            className={`w-[90%] sm:w-full h-20 sm:h-16 border border-ldarkBlue rounded-2xl flex items-center justify-between px-20 sm:px-4 mt-10`}>
            <p style={{cursor: "pointer"}} onClick={() => {
                handleOnStepClicked('year')
            }}
               className={`${stepNumber === 1 ? "text-ldarkBlue" : "text-gray-300"} text-2xl sm:text-lg font-semibold`}>{t("Year")}</p>
            <p style={{cursor: "pointer"}} onClick={() => {
                handleOnStepClicked('subject')
            }}
               className={`${stepNumber === 2 ? "text-ldarkBlue" : "text-gray-300"} text-2xl sm:text-lg font-semibold`}>{t("Subject")}</p>
            <p style={{cursor: "pointer"}} onClick={() => {
                handleOnStepClicked('system')
            }}
               className={`${stepNumber === 3 ? "text-ldarkBlue" : "text-gray-300"} text-2xl sm:text-lg font-semibold`}>{t("System")}</p>
            <p style={{cursor: "pointer"}} onClick={() => {
                handleOnStepClicked('topic')
            }}
               className={`${stepNumber === 4 ? "text-ldarkBlue" : "text-gray-300"} text-2xl sm:text-lg font-semibold`}>{t("Topic")}</p>
        </div>
    </div>;
}

export default StepBar;