import React from 'react';
import {useTranslation} from "react-i18next";

const ActionButtons = ({onClick = null}) => {
    const {t, i18n} = useTranslation("common");
    const handleClick = (isExam) => {
        if (onClick) {
            onClick(isExam);
        }
        // if(isExam){
        //     localStorage.setItem('type' , 'exam');
        // }else{
        //     localStorage.setItem('type' , 'study');
        // }
    }
    return (
        <div className="w-full flex space-x-4 mt-6">
            <button onClick={()=> handleClick(true)} className="w-full px-4 py-2 bg-blue-100 text-blue-900 rounded border border-blue-500">{t("ExamMood")}
            </button>
            <button onClick={()=> handleClick(false)} className="w-full px-4 py-2 bg-blue-500 text-white rounded">{t("StudyMood")}</button>
        </div>
    );
};

export default ActionButtons;
