import React, {useEffect, useState} from "react";
import NumberScroll from "@/pages/components/Quiz/NumberScroll";
import QuestionItem from "@/pages/components/Quiz/QuestionItem";
import Image from "next/image";
import icon1 from "../../../../public/icon_1.svg";
import icon2 from "../../../../public/icon_2.svg";
import icon3 from "../../../../public/icon_3.svg";
import hint from "../../../../public/hint.svg";
import video_hint from "../../../../public/video_hint.svg";
import copy from "../../../../public/copy.svg";
import {toast} from "react-toastify";
import CountdownTimer from "@/pages/components/Quiz/CountdownTimer";
import {useRouter} from "next/router";
import FavoritesModal from "@/pages/components/Favourites/FavoritesModal";
import YouTubePlayer from "@/pages/components/utils/YouTubePlayer";
import NotesModal from "@/pages/components/utils/NotesModal";
import CountUpTimer from "@/pages/components/Quiz/CountUpTimer";
import ReportsModal from "@/pages/components/utils/ReportsModal";
import SplashScreen from "@/pages/components/SplashScreen";
import HighlightedText from "@/pages/components/Questions/HighlightedText";
import {useTranslation} from "react-i18next";

const QuestionWindow = ({
                            examJourneyId,
                            questions,
                            type,
                            progress: historyProgress,
                            numbers,
                            questionIndex,
                            time,
                            onCheck,
                            length,
                            questionId,
                            nextIndex,
                            prevIndex,
                            setcurrentQuestion,
                            lastIndex,
                            reviewExam,
                            setReviewExam,
                        }) => {
    const {t, i18n} = useTranslation("common");
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isNotesModalOpen, setNotesModalOpen] = useState(false);
    const [isReportsModalOpen, setReportsModalOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [showVideoHint, setShowVideoHint] = useState(false);
    const [answerCounter, setAnswerCounter] = useState(0);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const skipped = [];
    const openModal = () => setModalOpen(true);
    const openNotesModal = () => setNotesModalOpen(true);
    const openReportsModal = () => setReportsModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const closeNotesModal = () => setNotesModalOpen(false);
    const closeReportsModal = () => setReportsModalOpen(false);

    const handleNextQuestion = () => {
        if (questionIndex === numbers[numbers.length - 1]) {
            if (Object.keys(historyProgress).length < length) {
                toast.error(t("AnswerAllQuestions"));
                return false;
            }
            setShowResults(true);
            return;
        }

        if (questionIndex !== numbers[numbers.length - 1]) {
            setcurrentQuestion(nextIndex);
            setSelectedNumber(nextIndex);
            router.push(`/quiz?id=${examJourneyId}&q=${nextIndex}`);
        }
    };
    if (numbers) {
        if (time) {
            // Split the time string into hours, minutes, and seconds
            const [hours, minutes, seconds] = time.split(":").map(Number);
            // Convert the time to total seconds
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            time = totalSeconds;
        } else {
            if (type === "study") {
                time = 0;
            } else {
                time = 60 * numbers.length;
            }
        }
    }

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(time);
    if (!historyProgress) {
        historyProgress = {};
    }

    const mappedProgress = Object.entries(historyProgress).reduce(
        (acc, [key, value]) => {
            acc[key] = value.is_correct;
            return acc;
        },
        {}
    );
    // Create a list of keys
    const numbersOfAnsweredQuestions = Object.keys(mappedProgress);

    if (
        !numbersOfAnsweredQuestions.includes(parseInt(questionIndex)?.toString())
    ) {
        numbersOfAnsweredQuestions.map((key) => {
            if (key?.toString() !== questionIndex?.toString()) {
                return skipped.push(parseInt(key));
            } else {
                if (skipped.includes(parseInt(key))) {
                    return skipped.splice(skipped.indexOf(parseInt(key)), 1);
                }
            }
        });
    }

    const progress = Object.keys(mappedProgress).map(
        (key) => mappedProgress[key]
    );
    const [answers, setAnswers] = useState(
        mappedProgress[questionIndex?.toString()]
    );

    const calculateTruePercentage = (progress) => {
        const values = Object.values(progress);
        const total = values.length;
        const trueCount = values.filter((value) => value === true).length;
        const percentage = (trueCount / total) * 100;
        return parseFloat(percentage.toFixed(1));
    };
    const valuesToHighlight = questions?.hint
        .split(",")
        .map((value) => value.trim());

    // Step 2: Split the text into words
    const text = questions && questions.text;
    const words = text ? text.split(" ") : [];
    const highlightedText = words.map((word, index) => {
        const isHighlighted = valuesToHighlight.includes(word);
        return (
            <span
                key={index}
                style={{
                    backgroundColor: isHighlighted ? "yellow" : "transparent",
                }}
            >
        {word}
                {/* Adding a space after each word */}
                {index < words.length - 1 ? " " : ""}
      </span>
        );
    });

    const handleAnswerClicked = () => {
        if (type === "study" && actionBtnText === t("Next")) {
            setActionBtnText(t("check"));
            setcurrentQuestion(nextIndex);
            setSelectedNumber(nextIndex);
            return;
        }
        if (
            selectedAnswer === null &&
            !historyProgress[questionIndex]?.is_disabled
        ) {
            if (toast.isActive) {
                toast.dismiss();
                toast.error(t("PleaseSelectAtLeastOne"));
            }
            return;
        }

        if (questionIndex === numbers[numbers.length - 1]) {
            if (
                selectedAnswer !== null &&
                !historyProgress[questionIndex]?.is_disabled
            ) {
                onCheck(
                    questions.answers[selectedAnswer].answer_text,
                    selectedAnswer,
                    timeLeft
                );
                setAnswerCounter(answerCounter + 1);
            }

            if (type === "exam") {
                if (Object.keys(historyProgress).length + 1 < length) {
                    toast.error(t("AnswerAllQuestions"));
                } else {
                    setShowResults(true);
                }
                return;
            }

            if (
                Object.keys(historyProgress).length < length &&
                selectedAnswer !== null
            ) {
                setSelectedAnswer(null);
                return;
            }
            if (
                Object.keys(historyProgress).length < length &&
                selectedAnswer === null
            ) {
                toast.error(t("AnswerAllQuestions"));
                return;
            }

            return;
        }

        if (!historyProgress[questionIndex]?.is_disabled) {
            onCheck(
                questions.answers[selectedAnswer].answer_text,
                selectedAnswer,
                timeLeft
            );
            if (type === "exam") {
                setAnswerCounter(answerCounter + 1);
                setcurrentQuestion(nextIndex);
                setSelectedNumber(nextIndex);
                router.push(`/quiz?id=${examJourneyId}&q=${nextIndex}`);
            } else if (type === "study") {
                //     do nothing
            }
        }

        setSelectedAnswer(null);
        if (questionIndex === numbers[numbers.length - 1] && !isLastQuestion) {
            setIsLastQuestion(true);
            setActionBtnText(t("Submit"));
            return;
        }
    };

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
    };
    let [actionBtnText, setActionBtnText] = useState(t("Check"));


    if (!questions) {
        return (
            <div>
                <SplashScreen/>
            </div>
        );
    }
    return (
        <div className="w-full   p-4 flex flex-col items-center justify-center">
            <FavoritesModal
                isOpen={isModalOpen}
                onClose={closeModal}
                question={questions}
            ></FavoritesModal>
            <NotesModal
                isOpen={isNotesModalOpen}
                onClose={closeNotesModal}
                question={questions.id}
            ></NotesModal>
            <ReportsModal
                isOpen={isReportsModalOpen}
                onClose={closeReportsModal}
                question={questions.id}
            ></ReportsModal>
            <div className="w-full  max-w-5xl bg-white p-6">
                <div
                    onClick={() => {
                        router.push("/start");
                    }}
                    style={{cursor: "pointer"}}
                    className="text-green-500 text-2xl hover:underline"
                >
                    {t("BackToGenerateQuizPage")}
                </div>
                <div className="w-full mt-4 flex justify-between items-center pe-4">
                    <div className="text-navyBlue text-3xl font-semibold">
                        {t("Quiz")}:{" "}
                        <span className="text-2xl text-gray-500">
              {type === "study" ? t("StudyMood") : t("ExamMood")}
            </span>
                    </div>
                    {showResults ? (
                        ""
                    ) : (
                        <div className={`w-full flex items-center justify-center`}>
                            <Image
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    openReportsModal();
                                }}
                                className={`mx-2 sm:mx-0`}
                                src={icon1}
                                alt={``}
                                width={35}
                                height={35}
                            />
                            {type === "study" ? (
                                <>
                                    <Image
                                        style={{cursor: "pointer"}}
                                        onClick={() => {
                                            setShowHint(!showHint);
                                            setShowVideoHint(false);
                                        }}
                                        className={`mx-2 sm:mx-0`}
                                        src={hint}
                                        alt={``}
                                        width={35}
                                        height={35}
                                    />
                                    <Image
                                        style={{cursor: "pointer"}}
                                        onClick={() => {
                                            setShowHint(false);
                                            setShowVideoHint(!showVideoHint);
                                        }}
                                        className={`mx-2 sm:mx-0`}
                                        src={video_hint}
                                        alt={``}
                                        width={35}
                                        height={35}
                                    />
                                </>
                            ) : (
                                ""
                            )}

                            <Image
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    //     add to favourites
                                    openModal();
                                }}
                                className={`mx-2 sm:mx-0`}
                                src={icon2}
                                alt={``}
                                width={35}
                                height={35}
                            />
                            <Image
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    openNotesModal();
                                }}
                                className={`mx-2 sm:mx-0`}
                                src={icon3}
                                alt={``}
                                width={35}
                                height={35}
                            />


                            {type === "study" ? (
                                <Image
                                    style={{cursor: "pointer"}}
                                    onClick={() => {
                                        navigator.clipboard
                                            .writeText(questions.text)
                                            .then(() => {
                                                toast.success(t("Copied"));
                                            })
                                            .catch((err) => {
                                                console.error("Failed to copy text: ", err);
                                            });
                                    }}
                                    className={`mx-2 sm:mx-0`}
                                    src={copy}
                                    alt={``}
                                    width={35}
                                    height={35}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    )}
                    {showResults ? (
                        ""
                    ) : (
                        <div className={`sm:mt-20`}>
                            {type === "study" ? (
                                <CountUpTimer
                                    max={100000}
                                    start={time}
                                    onTimeChange={(time_elapsed) => {
                                        setTimeLeft(time_elapsed);
                                    }}
                                ></CountUpTimer>
                            ) : (
                                <CountdownTimer
                                    initialSeconds={timeLeft}
                                    onTimeChange={(time_left) => {
                                        if (time_left === 0) {
                                            setShowResults(true);
                                        }
                                        setTimeLeft(time_left);
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
                {showHint ? (
                    <div className="w-full  rounded-xl p-4 mx-4 text-3xl text-center text-gray-500">
                        {questions.hint === "" ? (
                            t("NoHintAvailable")
                        ) : (
                            <button
                                onClick={() => {
                                    document.querySelector("#hintLayer").style.display = "flex";
                                }}
                                className="bg-blue-500 text-[18px] text-white border-0 rounded-md px-4 py-2"
                            >
                                show hint
                            </button>
                        )}
                        <div
                            id="hintLayer"
                            style={{display: "none"}}
                            className="fixed bg-black bg-opacity-20 z-[999999] top-0 start-0 end-0 bottom-0 justify-center items-center"
                        >
                            <div className="w-[40%] md:w-[90%] p-[32px] relative bg-white rounded-lg">
                                <h3 className="text-black font-bold text-[24px] text-center">
                                    {questions.hint}
                                </h3>
                                <div className="absolute top-0 end-0 p-2">
                                    <div
                                        onClick={() => {
                                            document.querySelector("#hintLayer").style.display =
                                                "none";
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="#0f0f0f"
                                                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {showVideoHint ? (
                    <div className="w-full  rounded-xl p-4 mx-4 text-3xl text-center text-gray-500">
                        {questions.video_hint === "" ? (
                            t("NoVideoAvailable")
                        ) : (
                            <YouTubePlayer url={`${questions.video_hint}`}/>
                        )}
                    </div>
                ) : (
                    ""
                )}

                <div className="w-full flex flex-wrap gap-4 mt-4 ">
                    {showResults ? (
                        <>
                            <div
                                className="w-full mt-2 flex flex-col rounded-xl text-black p-4 mx-4 text-3xl text-center">
                                <div>
                                    {JSON.stringify(calculateTruePercentage(progress)) === "null"
                                        ? "Time finished"
                                        : `Your score is ${calculateTruePercentage(progress)}%`}
                                </div>
                                <div>
                                    {`${
                                        progress.filter((value) => value === true).length
                                    } correct answers out of ${numbers.length} questions`}
                                </div>
                                <div className="text-center mt-5 text-[20px]">
                                    {type === "exam" && (
                                        <button
                                            onClick={() => {
                                                setReviewExam(true);
                                                setShowResults(false);
                                                setSelectedAnswer(null);
                                            }}
                                            className="bg-blue-500 rounded-xl px-4 py-2 text-white"
                                        >
                                            {t("reviewResults")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>

                            <div className={`w-[10%] md:w-full max-h-[416px] md:h-auto pt-2`}>
                                {/* TODO :: check the skipped items before the clicked number */}
                                <NumberScroll
                                    numbers={numbers}
                                    selected={parseInt(questionIndex)}
                                    skipped={skipped}
                                    historyProgress={historyProgress}
                                    selectedNumber={selectedNumber}
                                    setSelectedNumber={setSelectedNumber}
                                    onNumberClicked={(questionNumber) => {
                                        if (type === "study" && actionBtnText === t("Next")) {
                                            setActionBtnText(t("check"));
                                        }
                                        if (!historyProgress[questionIndex]?.is_disabled) {
                                            setSelectedAnswer(null);
                                        }
                                        setcurrentQuestion(questionNumber);
                                        router.push(
                                            `/quiz?id=${examJourneyId}&q=${parseInt(questionNumber)}`
                                        );
                                    }}
                                    answers={type === "study" || reviewExam ? progress : null}
                                />
                            </div>

                            <div className="w-[85%] md:w-full mt-2 bg-blue-50 rounded-xl p-4 ">
                                <p className="text-lg font-bold text-black">
                                    {showHint ? highlightedText : questions.text}
                                </p>

                                <div className="w-full mt-4">
                                    {questions &&
                                        historyProgress &&
                                        questions.answers.map((option, index) => {
                                            const indexAsString = index?.toString();

                                            var answerState = "idle";
                                            var is_selected = selectedAnswer === index;
                                            var is_answered = false;
                                            if (historyProgress[questionIndex]) {
                                                is_answered =
                                                    questions.text ===
                                                    historyProgress[questionIndex]["question_text"] &&
                                                    historyProgress[questionIndex]["answer"] === option.answer_text;
                                                // Determine if the selected answer is correct or wrong
                                                if (
                                                    historyProgress[questionIndex]["correct_answer"] ===
                                                    option.answer_text
                                                ) {
                                                    answerState = "correct";
                                                }
                                            }
                                            if (is_answered) {
                                                is_selected = false;
                                                if (
                                                    historyProgress[questionIndex]["correct_answer"] ===
                                                    option.answer_text
                                                ) {
                                                    answerState = "correct";
                                                } else {
                                                    answerState = "wrong";
                                                }
                                            }

                                            return (
                                                <QuestionItem
                                                    question={option.answer_text}
                                                    image={option.image}
                                                    index={index}
                                                    answerState={
                                                        type === "study" || reviewExam
                                                            ? answerState
                                                            : "idle"
                                                    }
                                                    isSelected={is_selected || is_answered}
                                                    key={index}
                                                    onAnswer={handleAnswer}
                                                    is_disabled={
                                                        historyProgress[questionIndex]?.question_text ==  questions.text
                                                    }
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="w-full flex justify-between items-center mt-6 pe-4">
                    <div
                        className={`w-full flex items-center justify-center md:flex-col sm:space-y-2 `}
                    >
                        <button
                            onClick={() => {
                                if (questionIndex === numbers[0] || questionIndex <= 0) {
                                
                                    return;
                                }
                                if (!historyProgress[questionIndex]?.is_disabled) {
                                    setSelectedAnswer(null);
                                }
                                setcurrentQuestion(prevIndex);
                                setSelectedNumber(prevIndex);
                                router.push(`/quiz?id=${examJourneyId}&q=${prevIndex}`);
                            }}
                            className={`w-40 bg-blue-100 text-blue-500 rounded-lg py-2 px-4 ${
                                showResults ? "hidden" : ""
                            }`}
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={() => {
                                if (questionIndex >= numbers.length - 1) {
                                    return;
                                }
                                if (!historyProgress[questionIndex]?.is_disabled) {
                                    setSelectedAnswer(null);
                                }
                                setcurrentQuestion(nextIndex);
                                setSelectedNumber(nextIndex);
                                router.push(`/quiz?id=${examJourneyId}&q=${nextIndex}`);
                            }}
                            className={`w-40 mx-2 sm:mx-0 bg-blue-100 text-blue-500 rounded-lg py-2 px-4 ${
                                showResults ? "hidden" : ""
                            }`}
                        >
                            {">"}
                        </button>
                    </div>
                    <div className={`flex md:flex-col sm:space-y-2 text-xs`}>
                        {!reviewExam && (
                            <button
                                onClick={() => {
                                    router.push(`/`);
                                }}
                                className={`w-40 sm:w-full bg-gray-200 text-gray-700 rounded-lg py-2 px-4 mr-2 ${
                                    showResults ? "hidden" : ""
                                }`}
                            >
                                {t("ResumeLater")}
                            </button>
                        )}

                        {showResults ? (
                            <button
                                onClick={() => {
                                    router.replace("/");
                                }}
                                className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4"
                            >
                                Go to home
                            </button>
                        ) : (
                            <>
                                {historyProgress[questionIndex]?.is_disabled &&
                                    type !== "exam" && (
                                        <button
                                            onClick={handleNextQuestion}
                                            className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4"
                                        >
                                            {questionIndex === numbers[numbers.length - 1]
                                                ? t("Finish")
                                                : t("Next")}
                                        </button>
                                    )}
                                {!historyProgress[questionIndex]?.is_disabled &&
                                    type === "study" && (
                                        <button
                                            onClick={questionIndex == numbers[numbers.length - 1] ? () => {
                                                try {
                                                    onCheck(
                                                        questions.answers[selectedAnswer].answer_text,
                                                        selectedAnswer,
                                                        timeLeft
                                                    );
                                                    setShowResults(true);
                                                } catch (e) {
                                                    console.log(e);
                                                }

                                            } : handleAnswerClicked}
                                            className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4"
                                        >
                                            {actionBtnText}
                                            
                                        </button>
                                    )}
                                {type === "exam" && (
                                    <button
                                        onClick={questionIndex == numbers[numbers.length - 1] ? () => {
                                            try {
                                                onCheck(
                                                    questions.answers[selectedAnswer].answer_text,
                                                    selectedAnswer,
                                                    timeLeft
                                                );
                                            } catch (e) {
                                                console.log(e);
                                            }

                                            setShowResults(true);
                                        } : handleAnswerClicked}
                                        className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4"
                                    >

                                        {questionIndex == numbers[numbers.length - 1]
                                            ? t("Finish")
                                            : t("Next")}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionWindow;
