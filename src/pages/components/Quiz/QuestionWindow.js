import React, {useEffect, useState} from 'react';
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
}) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNotesModalOpen, setNotesModalOpen] = useState(false);
  const [isReportsModalOpen, setReportsModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [showVideoHint, setShowVideoHint] = useState(false);
  const [answerCounter , setAnswerCounter] = useState(0);
  const skipped = [];
  const openModal = () => setModalOpen(true);
  const openNotesModal = () => setNotesModalOpen(true);
  const openReportsModal = () => setReportsModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const closeNotesModal = () => setNotesModalOpen(false);
  const closeReportsModal = () => setReportsModalOpen(false);

  
  const handleNextQuestion = () => {
    console.log(questionIndex);

    if (parseInt(questionIndex) === numbers.length - 1) {
      if(answerCounter < length){
        toast.error(t("AnswerAllQuestions"));
        return false;
      }
      setShowResults(true);
      return;
    }
    if (questionIndex < length - 1) {
      router.push(`/quiz?id=${examJourneyId}&q=${parseInt(questionIndex) + 1}`);
    }
  }
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
      }else{
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

  if (!numbersOfAnsweredQuestions.includes(parseInt(questionIndex - 1).toString())) {
    for (let i = 0; i < questionIndex; i++) {
      if (!numbersOfAnsweredQuestions.includes(i.toString())) {
        skipped.push(i);
      }
    }
  }

  const progress = Object.keys(mappedProgress)
    .sort((a, b) => a - b) // Sort keys to ensure the correct order
    .map((key) => mappedProgress[key]);

  const [answers, setAnswers] = useState(mappedProgress["0"]);

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
    console.log(progress)

    if (selectedAnswer === null && !historyProgress[questionIndex]?.isDisabled) {
      if (toast.isActive) {
        toast.dismiss();
        toast.error(t("PleaseSelectAtLeastOne"));
      }
      return;
    }
    // console.log(numOfAnswers , length);
    console.log(answerCounter+1 , length);
    console.log(parseInt(questionIndex) === numbers.length - 1);
    
    if (parseInt(questionIndex) === numbers.length - 1) {
      if(selectedAnswer !== null && !historyProgress[questionIndex]?.isDisabled){
        onCheck(questions.answers[selectedAnswer].answer, selectedAnswer, timeLeft);
        setAnswerCounter(answerCounter+1);
      }
      console.log(answerCounter , length);
      
      if(answerCounter+1 < length && selectedAnswer !== null){
        if(type === 'exam'){
          toast.error(t("AnswerAllQuestions"));
        }
        setSelectedAnswer(null);
        return;
      }
      if(answerCounter +1 <= length && selectedAnswer === null){
        toast.error(t("AnswerAllQuestions"));
        return;
      }
      
      if(type === 'exam'){
        setShowResults(true);
      }
      return;
    }
    console.log('hello55');
    
    if(!historyProgress[questionIndex]?.isDisabled){
      onCheck(questions.answers[selectedAnswer].answer, selectedAnswer, timeLeft);
      console.log('hello');
      setAnswerCounter(answerCounter+1);
    }else{
      router.push(`/quiz?id=${examJourneyId}&q=${parseInt(questionIndex) + 1}`);
    }

    
    setSelectedAnswer(null);
    if (parseInt(questionIndex) === numbers.length - 1 && !isLastQuestion) {
       setIsLastQuestion(true);
       actionBtnText = t("Submit");
       return;
    }
    
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };
  let actionBtnText = t("Check");
  // if (numbers) {
  //   actionBtnText =
  //     parseInt(questionIndex) === numbers.length - 1 ? t("Check") : t("Check");
  // }

  if (!questions) {
    return (
      <div>
        <SplashScreen />
      </div>
    );
  }
  return (
    <div className="w-full h-full  p-4 flex flex-col items-center justify-center">
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
          style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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
                    style={{ cursor: "pointer" }}
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
                    style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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
                  style={{ cursor: "pointer" }}
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
            {questions.hint === "" ? t("NoHintAvailable") : questions.hint}
          </div>
        ) : (
          ""
        )}
        {showVideoHint ? (
          <div className="w-full  rounded-xl p-4 mx-4 text-3xl text-center text-gray-500">
            {questions.video_hint === "" ? (
              t("NoVideoAvailable")
            ) : (
              <YouTubePlayer url={`${questions.video_hint}`} />
            )}
          </div>
        ) : (
          ""
        )}

        <div className="w-full flex mt-4 max-h-screen">
          {showResults ? (
            <>
            {console.log(progress)}
              <div className="w-full mt-2 flex flex-col rounded-xl text-black p-4 mx-4 text-3xl text-center">
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
              </div>
            </>
          ) : (
            <>
              <div className={`w-fit max-h-[416px] pt-2`}>
                {/* TODO :: check the skipped items before the clicked number */}
                <NumberScroll
                  numbers={numbers}
                  selected={parseInt(questionIndex)}
                  skipped={skipped}
                  historyProgress={historyProgress}
                  onNumberClicked={(questionNumber) => {
                    if(!historyProgress[questionIndex]?.isDisabled){
                      setSelectedAnswer(null);
                      
                    }
                    router.push(
                      `/quiz?id=${examJourneyId}&q=${
                        parseInt(questionNumber) - 1
                      }`
                    );
                  }}
                  answers={type === "study" ? progress : null}
                />
              </div>

              <div className="w-full mt-2 bg-blue-50 rounded-xl p-4 mx-4">
                <p className="text-lg font-bold text-black">
                  {showHint ? highlightedText : questions.text}
                </p>
                <div className="w-full mt-4">
                  {questions &&
                    historyProgress &&
                    questions.answers.map((option, index) => {
                      const indexAsString = index.toString();

                      var answerState = "idle";
                      var is_selected = selectedAnswer === index;
                      var is_answered = false;
                      if (historyProgress[questionIndex]) {
                        is_answered =
                          questions.text ===
                            historyProgress[questionIndex]["question_text"] &&
                          historyProgress[questionIndex]["answer"] === index;
                        // Determine if the selected answer is correct or wrong
                        if (
                          historyProgress[questionIndex]["correct_answer"] ===
                          option.answer
                        ) {
                          answerState = "correct";
                        }
                      }
                      if (is_answered) {
                        is_selected = false;
                        if (
                          historyProgress[questionIndex]["correct_answer"] ===
                          option.answer
                        ) {
                          answerState = "correct";
                        } else {
                          answerState = "wrong";
                        }
                      }

                      return (
                        <QuestionItem
                          question={option.answer}
                          index={index}
                          answerState={type === "study" ? answerState : "idle"}
                          isSelected={is_selected || is_answered}
                          key={index}
                          onAnswer={handleAnswer}
                          isDisabled={
                            historyProgress[questionIndex]?.isDisabled || false
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
                if (questionIndex <= 0) {
                  return;
                }
                if(!historyProgress[questionIndex]?.isDisabled){
                  setSelectedAnswer(null);
                  
                }
                router.push(
                  `/quiz?id=${examJourneyId}&q=${parseInt(questionIndex) - 1}`
                );
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
                if(!historyProgress[questionIndex]?.isDisabled){
                  setSelectedAnswer(null);
                  
                }
                router.push(
                  `/quiz?id=${examJourneyId}&q=${parseInt(questionIndex) + 1}`
                );
              }}
              className={`w-40 mx-2 sm:mx-0 bg-blue-100 text-blue-500 rounded-lg py-2 px-4 ${
                showResults ? "hidden" : ""
              }`}
            >
              {">"}
            </button>
          </div>
          <div className={`flex md:flex-col sm:space-y-2 text-xs`}>
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
                {historyProgress[questionIndex]?.isDisabled &&
                  type !== "exam" && (
                    <button
                      onClick={handleNextQuestion}
                      className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4"
                    >
                      {parseInt(questionIndex) === length - 1 ? t("Finish") : t("Next")}
                    </button>
                  )}
                {!historyProgress[questionIndex]?.isDisabled &&
                  type !== "exam" && (
                    <button
                      onClick={handleAnswerClicked}
                      className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4"
                    >
                      {actionBtnText}
                    </button>
                  )}
                {type === "exam" && (
                  <button
                    onClick={handleAnswerClicked}
                    className="w-40 sm:w-full bg-blue-500 text-white rounded-lg py-2 px-4"
                  >
                    {parseInt(questionIndex) === length - 1 ? t("Finish") : t("Next")}
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
