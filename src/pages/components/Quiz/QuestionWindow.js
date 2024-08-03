import React, {useState} from 'react';
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

const QuestionWindow = ({
                            examJourneyId,
                            questions,
                            type,
                            progress: historyProgress,
                            numbers,
                            questionIndex,
                            time,
                            onCheck
                        }) => {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isNotesModalOpen, setNotesModalOpen] = useState(false);
    const [isReportsModalOpen, setReportsModalOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showVideoHint, setShowVideoHint] = useState(false);
    const openModal = () => setModalOpen(true);
    const openNotesModal = () => setNotesModalOpen(true);
    const openReportsModal = () => setReportsModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const closeNotesModal = () => setNotesModalOpen(false);
    const closeReportsModal = () => setReportsModalOpen(false);

    if (!time) {
        time = 500;
    }
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(time);
    if(!historyProgress) {
        historyProgress = {};
    }
    const mappedProgress = Object.entries(historyProgress).reduce((acc, [key, value]) => {
        acc[key] = value.is_correct;
        return acc;
    }, {});
    const [progress, setProgress] = useState(mappedProgress);

    const calculateTruePercentage = (progress) => {
        const values = Object.values(progress);
        const total = values.length;
        const trueCount = values.filter(value => value === true).length;
        return (trueCount / total) * 100;
    };

    const handleAnswerClicked = () => {
        if (selectedAnswer === null) {
            toast.error("Select At least one Answer");
            return;
        }
        setProgress(prevProgress => ({
            ...prevProgress,
            [questionIndex]: questions.answers[selectedAnswer].answer === questions.correct_answer.answer
        }));
        onCheck(selectedAnswer, timeLeft);
        setSelectedAnswer(null);
        if (parseInt(questionIndex) === numbers.length - 1) {
            setShowResults(true);
        }
    };

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
    };

    if(!questions){
        return <div>
            <SplashScreen />
        </div>
    }
    return (
        <div className="w-full h-full min-h-screen bg-white p-4 flex flex-col items-center">
            <FavoritesModal isOpen={isModalOpen} onClose={closeModal}>

            </FavoritesModal>
            <NotesModal isOpen={isNotesModalOpen} onClose={closeNotesModal} question={questions.id}>

            </NotesModal>
            <ReportsModal isOpen={isReportsModalOpen} onClose={closeReportsModal} question={questions.id}>

            </ReportsModal>
            <div className="w-full max-w-5xl bg-white p-6">
                <div style={{cursor: "pointer"}} className="text-green-500 text-2xl hover:underline">
                    Back to generate quiz page
                </div>
                <div className="w-full mt-4 flex justify-between items-center pe-4">
                    <div className="text-navyBlue text-3xl font-semibold">Quiz: <span
                        className="text-2xl text-gray-500">Level 6</span>
                    </div>
                    <div className={`w-full flex items-center justify-center`}>
                        <Image style={{cursor: "pointer"}} onClick={()=>{
                            openReportsModal()
                        }} className={`mx-2 sm:mx-0`} src={icon1} alt={``} width={35} height={35}/>
                        {type === 'study' ? <><Image style={{cursor: "pointer"}} onClick={() => {
                            setShowHint(!showHint);
                            setShowVideoHint(false);
                        }} className={`mx-2 sm:mx-0`} src={hint} alt={``} width={35} height={35}/>
                            <Image style={{cursor: "pointer"}} onClick={() => {
                                setShowHint(false);
                                setShowVideoHint(!showVideoHint);
                            }} className={`mx-2 sm:mx-0`} src={video_hint} alt={``} width={35} height={35}/></> : ""}


                        <Image style={{cursor: "pointer"}} onClick={() => {
                            //     add to favourites
                            openModal()
                        }} className={`mx-2 sm:mx-0`} src={icon2} alt={``} width={35} height={35}/>
                        <Image style={{cursor: "pointer"}} onClick={() => {
                            openNotesModal();
                        }} className={`mx-2 sm:mx-0`} src={icon3} alt={``} width={35} height={35}/>
                        {type === 'study' ? <Image style={{cursor: "pointer"}} onClick={()=>{
                            navigator.clipboard.writeText(questions.text).then(() => {
                                toast.success("Copied to clipboard");
                            }).catch(err => {
                                console.error('Failed to copy text: ', err);
                            });
                        }} className={`mx-2 sm:mx-0`} src={copy} alt={``} width={35} height={35}/> : ""}
                    </div>
                    {type === "study" ? <CountUpTimer max={10000} onTimeChange={(time_elapsed) => {
                        setTimeLeft(time_elapsed);
                    }}></CountUpTimer> : <CountdownTimer initialSeconds={timeLeft} onTimeChange={(time_left) => {
                        if (time_left === 0) {
                            setShowResults(true);
                        }
                        setTimeLeft(time_left);
                    }}/>}

                </div>
                {showHint ? <div
                    className="w-full  rounded-xl p-4 mx-4 text-3xl text-center text-gray-500">{questions.hint === "" ? "No Hint Available" : questions.hint}</div> : ""}
                {showVideoHint ? <div
                    className="w-full  rounded-xl p-4 mx-4 text-3xl text-center text-gray-500">{questions.video_hint === "" ? "No Video Available" :
                    <YouTubePlayer url={`${questions.video_hint}`}/>}</div> : ""}

                <div className="w-full flex mt-4 max-h-screen">
                    {showResults ? <>
                            <div className="w-full mt-2 bg-blue-50 rounded-xl p-4 mx-4 text-3xl text-center">
                                {JSON.stringify(calculateTruePercentage(progress)) === "null" ? "Time finished" : `Your score is ${calculateTruePercentage(progress)}%`}

                            </div>
                        </>
                        : <>
                            <div className={`w-fit max-h-[416px] pt-2`}>
                                <NumberScroll numbers={numbers} selected={parseInt(questionIndex)} answers={type === "study" ? progress : null}/>
                            </div>

                            <div className="w-full mt-2 bg-blue-50 rounded-xl p-4 mx-4">

                                <p className="text-lg font-bold">
                                    {questions && questions.text}</p>
                                <div className="w-full mt-4">
                                    {questions && questions.answers.map((option, index) => (
                                        <QuestionItem question={option.answer} index={index}
                                                      isSelected={index === selectedAnswer}
                                                      key={index} onAnswer={handleAnswer}/>
                                    ))}
                                </div>
                            </div>
                        </>}

                </div>

                <div className="w-full flex justify-between items-center mt-6 pe-4">
                    <button
                        onClick={() => {
                            router.push(`/quiz?id=${examJourneyId}&q=${parseInt(questionIndex) - 1}`);
                        }}
                        className={`w-40 bg-blue-100 text-blue-500 rounded-lg py-2 px-4 ${showResults ? "hidden" : ""}`}>{"<"}</button>
                    .
                    <div className={`sm:flex text-xs`}>
                        <button
                            onClick={() => {
                                router.push(`/home`)
                            }}
                            className={`w-40 sm:w-full bg-gray-200 text-gray-700 rounded-lg py-2 px-4 mr-2 ${showResults ? "hidden" : ""}`}>Resume
                            Later
                        </button>
                        {showResults ? <button onClick={() => {
                                router.replace("/home");
                            }}
                                               className="w-40 bg-blue-500 text-white rounded-lg py-2 px-4">Go to home
                            </button>
                            :
                            <button onClick={handleAnswerClicked}
                                    className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4">Check
                            </button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionWindow;
