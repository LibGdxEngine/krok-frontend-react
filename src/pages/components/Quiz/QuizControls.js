import { memo } from "react";
import { useTranslation } from "react-i18next";

// src/pages/components/Quiz/QuizControls.js
const QuizControls = ({ questionIndex, totalQuestions, isAnswered, isSelected, quizType, reviewMode, onPrev, onNext, onCheckOrSubmit, onResumeLater }) => {
    const { t } = useTranslation("common");
    const isFirstQuestion = questionIndex === 0;
    const isLastQuestion = questionIndex === totalQuestions - 1;
    
    // Determine the text for the main action button
    let actionButtonText = t("Check"); // Default for study mode, first check
    if (quizType === 'exam') {
        actionButtonText = isLastQuestion ? t("Finish") : t("Next");
    } else if (quizType === 'study') {
        if (isAnswered) {
             actionButtonText = isLastQuestion ? t("Finish") : t("Next");
        } else {
            actionButtonText = isLastQuestion ? t("Finish") : t("Check"); // Check first, then Finish on last
        }
    }
     if (reviewMode) {
        actionButtonText = isLastQuestion ? t("FinishReview") : t("Next"); // Different text in review
     }


    return (
        <div className="w-full flex flex-wrap justify-between items-center mt-6 pe-4 gap-y-3 gap-x-2">
            {/* Navigation Buttons (Prev/Next) */}
             <div className="flex items-center justify-center gap-2">
                 <button
                    onClick={onPrev}
                    disabled={isFirstQuestion}
                    className={`w-32 sm:w-28 bg-blue-100 text-blue-500 rounded-lg py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {"<"} {/* Or use < */}
                </button>
                <button
                    onClick={onNext}
                    disabled={isLastQuestion}
                     // In study mode, only enable next if answered OR if skipping is intended (could add skip button)
                    // disabled={isLastQuestion || (quizType === 'study' && !isAnswered && !reviewMode)}
                    className={`w-32 sm:w-28 bg-blue-100 text-blue-500 rounded-lg py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {">"} {/* Or use > */}
                </button>
            </div>

            {/* Action Buttons (Resume Later / Check/Submit/Finish) */}
             <div className="flex items-center justify-center gap-2">
                {!reviewMode && ( // Don't show "Resume Later" during review
                    <button
                        onClick={onResumeLater}
                        className="w-40 sm:w-32 bg-gray-200 text-gray-700 rounded-lg py-2 px-4 text-sm"
                    >
                        {t("ResumeLater")}
                    </button>
                )}

                 <button
                    onClick={onCheckOrSubmit}
                     // Disable check/submit if:
                     // - In study/exam mode, it's already answered AND NOT the last question (use Next instead)
                     // - In review mode (use Next/Prev instead)
                     // - No answer is selected (and it's not answered yet)
                    disabled={
                        // (isAnswered && !isLastQuestion && !reviewMode) ||
                        reviewMode ||
                        (!isAnswered && !isSelected)
                    }
                    className="w-40 sm:w-32 bg-blue-500 text-white rounded-lg py-2 px-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {actionButtonText}
                </button>
            </div>
        </div>
    );
};

export default memo(QuizControls);