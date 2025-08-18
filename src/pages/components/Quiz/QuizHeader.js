import { memo } from "react";
import Image from "next/image";
import icon1 from "../../../../public/icon_1.svg";
import icon2 from "../../../../public/icon_2.svg";
import icon3 from "../../../../public/icon_3.svg";
import hint from "../../../../public/hint.svg";
import video_hint from "../../../../public/video_hint.svg";
import copy from "../../../../public/copy.svg";
import CountdownTimer from "@/pages/components/Quiz/CountdownTimer";
import CountUpTimer from "@/pages/components/Quiz/CountUpTimer";
import { useTranslation } from "react-i18next";

// src/pages/components/Quiz/QuizHeader.js
const QuizHeader = ({ quizType, initialTime, timeLeft, onTimeChange, onTimeUp, showResultsPage, onOpenReport, onOpenFavorites, onOpenNotes, onCopy, showHint, showVideoHint, onShowHintToggle, onShowVideoHintToggle, hasHint, hasVideoHint }) => {
    const { t } = useTranslation("common");
    // Import necessary icons (icon1, icon2, icon3, hint, video_hint, copy) and Timer components
    // ... imports for Image, icons, CountdownTimer, CountUpTimer

    return (
        <div className="w-full flex flex-wrap justify-between items-center pe-4 gap-y-2">
            {/* Title */}
            <div className="text-navyBlue text-2xl md:text-xl font-semibold">
                {t("Quiz")}:{" "}
                <span className="text-lg text-gray-500">
                    {quizType === "study" ? t("StudyMood") : t("ExamMood")}
                </span>
            </div>
            
            {/* Icons (Hide on results page) */}
            {!showResultsPage && (
                <div className="flex items-center justify-center space-x-2 sm:space-x-1 flex-wrap">
                     {/* Report Icon */}
                    <Image alt={''} style={{ cursor: "pointer" }} onClick={onOpenReport} className="mx-1" src={icon1}  width={30} height={30}  />

                    {/* Study Mode Icons */}
                    {quizType === "study" && (
                        <>
                            {<Image alt={''} style={{ cursor: "pointer" }} onClick={onShowHintToggle} className={`mx-1 `} src={hint}  width={30} height={30}  />}
                            {<Image alt={''} style={{ cursor: "pointer" }} onClick={onShowVideoHintToggle} className={`mx-1`} src={video_hint}  width={30} height={30}  />}
                             <Image alt={''} style={{ cursor: "pointer" }} onClick={onCopy} className="mx-1" src={copy}  width={30} height={30}  />
                        </>
                    )}
                     {/* Favourite Icon */}
                    <Image  alt={''} style={{ cursor: "pointer" }} onClick={onOpenFavorites} className="mx-1" src={icon2}  width={30} height={30}  />
                     {/* Notes Icon */}
                    <Image alt={''} style={{ cursor: "pointer" }} onClick={onOpenNotes} className="mx-1" src={icon3}  width={30} height={30}  />
                </div>
            )}

            {/* Timer (Hide on results page) */}
            {!showResultsPage && (
                 <div className="sm:mt-2 text-lg font-medium">
                     {quizType === "study" ? (
                        <CountUpTimer
                            maxSeconds={36000} // Set a high max for study mode if needed
                            initialSeconds={initialTime} // Start from saved time or 0
                            onTimeChange={onTimeChange}
                         />
                    ) : (
                        <CountdownTimer
                            initialSeconds={initialTime} // Start from saved time or calculated time
                            onTimeChange={onTimeChange}
                            onTimeUp={onTimeUp} // Trigger finish when time runs out
                        />
                    )}
                 </div>
             )}
        </div>
    );
};

export default memo(QuizHeader);