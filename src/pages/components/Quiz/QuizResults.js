import { memo } from "react";
import { useTranslation } from "react-i18next";

// src/pages/components/Quiz/QuizResults.js
const QuizResults = ({ score, correctCount, totalQuestions, quizType, onReview, onGoHome }) => {
    const { t } = useTranslation("common");

    return (
       <div className="w-full mt-6 flex flex-col items-center rounded-xl text-black p-6 bg-green-50 text-center">
            <h2 className="text-2xl font-semibold mb-4">{t("QuizCompleted")}</h2>
            {score !== null && score !== undefined ? (
               <p className="text-xl mb-2">
                   {t("YourScoreIs")} <span className="font-bold">{score}%</span>
               </p>
            ) : (
                <p className="text-xl mb-2">{t("ResultsCalculating")}</p> // Or Time Finished message
            )}
            <p className="text-lg mb-6">
                {t("CorrectAnswersOutOfTotal", { correct: correctCount ?? '?', total: totalQuestions ?? '?' })}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
                {/* Show Review Button only for exam type or if always desired */}
               {(quizType === "exam" || quizType === "study") && ( // Allow review for study mode too if desired
                   <button
                       onClick={onReview}
                       className="bg-blue-500 hover:bg-blue-600 rounded-xl px-6 py-2 text-white text-lg"
                   >
                       {t("reviewResults")}
                   </button>
                )}
                <button
                    onClick={onGoHome}
                    className="bg-gray-500 hover:bg-gray-600 rounded-xl px-6 py-2 text-white text-lg"
                >
                   {t("GoToHome")} {/* Changed text slightly */}
               </button>
           </div>
       </div>
   );
};

export default memo(QuizResults);