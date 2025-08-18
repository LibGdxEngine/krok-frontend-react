import React, { useEffect, useState } from 'react';
import {useTranslation} from "react-i18next";

const QuestionsPractice = ({ onChange = null, selected, questionsCount }) => {
    const {t, i18n} = useTranslation("common");
    const [numberOfQuestions, setNumberOfQuestions] = useState(questionsCount);

    const handleIncrease = () => {
        if (numberOfQuestions < 200) {
            setNumberOfQuestions((prevState) => prevState + 1);
        }
    };

    const handleDecrease = () => {
        if (numberOfQuestions > 0) {
            setNumberOfQuestions((prevState) => prevState - 1);
        }
    };

    useEffect(() => {
        onChange(numberOfQuestions);
    }, [numberOfQuestions, onChange]);

    useEffect(() => {
        setNumberOfQuestions(questionsCount);
    }, [questionsCount]);

    return (
        <div className="w-full h-full bg-blue-50 p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-900 mb-4">{t("HowManyQuestions")}</h2>
            <div className="mb-4 text-gray-500">{t("YouWillHave")} {questionsCount} {t("Questions")}.</div>
            <div className="flex items-center space-x-2">
                {/*<button onClick={handleDecrease} className="px-2 py-1 bg-blue-100 rounded">{"<"}</button>*/}
                {/*<input*/}
                {/*    type="text"*/}
                {/*    value={numberOfQuestions}*/}
                {/*    onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}*/}
                {/*    className="w-16 text-center border border-gray-300 rounded"*/}
                {/*/>*/}
                {/*<button onClick={handleIncrease} className="px-2 py-1 bg-blue-100 rounded">{">"}</button>*/}

                {/*<input*/}
                {/*    type="text"*/}
                {/*    className="w-16 text-center border border-gray-300 rounded"*/}
                {/*    value={questionsCount}*/}
                {/*    readOnly*/}
                {/*/>*/}
            </div>
        </div>
    );
};

export default QuestionsPractice;
