// src/pages/components/Quiz/QuestionWindow.js (Refactored)
import Image from "next/image";
import icon1 from "../../../../public/icon_1.svg";
import icon2 from "../../../../public/icon_2.svg";
import icon3 from "../../../../public/icon_3.svg";
import hint from "../../../../public/hint.svg";
import video_hint from "../../../../public/video_hint.svg";
import copy from "../../../../public/copy.svg";
import CountdownTimer from "@/pages/components/Quiz/CountdownTimer";
import CountUpTimer from "@/pages/components/Quiz/CountUpTimer";
import NumberScroll from "@/pages/components/Quiz/NumberScroll";
import QuestionItem from "@/pages/components/Quiz/QuestionItem";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router"; // Keep for non-quiz navigation (e.g., Home, Back to Generate)
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// --- Import Sub-Components (Create these files) ---
// import QuizHeader from "./QuizHeader";
// import NumberScroll from "./NumberScroll";
// import QuestionDisplay from "./QuestionDisplay";
// import QuizControls from "./QuizControls";
// import QuizResults from "./QuizResults";
import HintDisplay from "./HintDisplay"; // Assuming HintDisplay exists and is okay

// --- Import Modals & Utils ---
import FavoritesModal from "@/pages/components/Favourites/FavoritesModal";
import NotesModal from "@/pages/components/utils/NotesModal";
import ReportsModal from "@/pages/components/utils/ReportsModal";
import SplashScreen from "@/pages/components/SplashScreen"; // For missing question case


const QuestionWindow = ({
  // --- Core Data ---
  examJourneyId,
  question,
  questionIndex, // Current index (number)
  totalQuestions,
  quizType,
  progress, // The whole progress object {'0':{...}, '1':{...}}
  initialTime,
  reviewMode,
  showResultsPage,

  // --- Callbacks from Parent (Quiz) ---
  onAnswerSubmit,
  onNavigate,
  onFinishQuiz,
  onResumeLater,
  onEnterReviewMode,

}) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  // --- Local State ---
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null); // Index of the selected answer (0, 1, 2, ...)
  const [timeLeft, setTimeLeft] = useState(initialTime); // Manage time locally based on initial time
  const [showHint, setShowHint] = useState(false);
  const [showVideoHint, setShowVideoHint] = useState(false);

  // Modal States
  const [isFavModalOpen, setFavModalOpen] = useState(false);
  const [isNotesModalOpen, setNotesModalOpen] = useState(false);
  const [isReportsModalOpen, setReportsModalOpen] = useState(false);

  // --- Derived Data (useMemo) ---
   const currentQuestionProgress = useMemo(() => progress?.[questionIndex.toString()], [progress, questionIndex]);
   const isAnswered = useMemo(() => !!currentQuestionProgress?.is_disabled, [currentQuestionProgress]); // Check if backend marked it answered/disabled
   const numbersArray = useMemo(() => Array.from({ length: totalQuestions }, (_, i) => i), [totalQuestions]); // Array [0, 1, 2...]


  // --- Effects ---
  // Reset local state when the question changes
  useEffect(() => {
    setSelectedAnswerIndex(null); // Clear selection when navigating to a new question
    setShowHint(false); // Hide hints on new question
    setShowVideoHint(false); // Hide video hint on new question
  }, [questionIndex, question?.id]); // Depend on questionIndex and question.id

  // --- Event Handlers ---
  const handleAnswerSelect = useCallback((index) => {
    // Allow changing selection only if the question hasn't been answered/submitted yet
    if (!isAnswered) {
        setSelectedAnswerIndex(index);
    }
  }, [isAnswered]); // Only depends on isAnswered


  // Called by Timer components
  const handleTimeChange = useCallback((newTime) => {
      setTimeLeft(newTime);
  }, []);

  const handleTimeUp = useCallback(() => {
      toast.warn(t("TimeExpired"));
      onFinishQuiz(0); // Finish quiz with 0 time left
  }, [onFinishQuiz, t]);

  // --- Button Actions ---
  const handleCheckOrSubmit = useCallback(() => {
      const isLast = questionIndex === totalQuestions - 1;


      
      if (selectedAnswerIndex === null && !isAnswered) {
          toast.dismiss(); // Dismiss previous toasts if any
          toast.error(t("PleaseSelectAtLeastOne"));
          return;
      }

      if (!isAnswered && selectedAnswerIndex !== null) {
          // Call the submission handler passed from the Quiz component
           const selectedAnswerText = question?.answers?.[selectedAnswerIndex]?.answer_text;
                 
           if (selectedAnswerText !== undefined) {
               onAnswerSubmit(questionIndex, selectedAnswerText, selectedAnswerIndex, timeLeft);
           } else {
               console.error("Selected answer text not found!");
               toast.error(t("ErrorSubmittingAnswer")); // Generic error
           }
      }
      // If not the last question (and already answered or just answered), make the click go to next question
      if (isAnswered && !isLast){
        handleNext(questionIndex + 1);
      }

      // If it's the last question (and already answered or just answered), trigger finish
      // Note: The onAnswerSubmit might handle navigation or showing results for exam mode
      if (isLast && (isAnswered || selectedAnswerIndex !== null)) {
         // Check if *all* questions have progress before finishing
         // This check might be slightly delayed due to async nature,
         // consider passing an 'allAnswered' flag from parent if needed immediately
          const allCurrentlyAnswered = Object.keys(progress).length >= totalQuestions;
          const answeredJustNow = !isAnswered && selectedAnswerIndex !== null;
          if (allCurrentlyAnswered || (answeredJustNow && Object.keys(progress).length + 1 >= totalQuestions) ) {
             onFinishQuiz(timeLeft);
          } else {
             toast.warning(t("AnswerAllQuestionsToFinish"));
          }
      }

  }, [
      questionIndex,
      totalQuestions,
      selectedAnswerIndex,
      isAnswered,
      onAnswerSubmit,
      onFinishQuiz,
      question, // question needed to get answer text
      timeLeft,
      t,
      progress // progress needed to check if all answered
  ]);

  const handleNext = useCallback(() => {
       if (questionIndex < totalQuestions - 1) {
            onNavigate(questionIndex + 1);
       }
  }, [questionIndex, totalQuestions, onNavigate]);

  const handlePrev = useCallback(() => {
      if (questionIndex > 0) {
          onNavigate(questionIndex - 1);
      }
  }, [questionIndex, onNavigate]);

  // --- Modal Open/Close Handlers ---
  const openModal = (setter) => () => setter(true);
  const closeModal = (setter) => () => setter(false);

  // --- Render Logic ---

  if (!question) {
    // Should be handled by parent, but render loading/error as fallback
    return <SplashScreen />;
  }

  // Calculate results if showResultsPage is true
  const resultsData = useMemo(() => {
    if (!showResultsPage) return null;

    const answeredQuestions = Object.values(progress);
    const correctCount = answeredQuestions.filter(p => p.is_correct === true).length;
    const totalAnswered = answeredQuestions.length; // Or use totalQuestions if score is based on total
    // Use totalQuestions for percentage calculation unless specified otherwise
    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    return {
      score: parseFloat(scorePercentage.toFixed(1)),
      correctCount: correctCount,
      totalQuestions: totalQuestions,
    };
  }, [showResultsPage, progress, totalQuestions]);


  return (
    <div className="w-full max-w-5xl p-4 flex flex-col items-center justify-center bg-white">
        {/* --- Modals --- */}
        <FavoritesModal isOpen={isFavModalOpen} onClose={closeModal(setFavModalOpen)} question={question} />
        <NotesModal isOpen={isNotesModalOpen} onClose={closeModal(setNotesModalOpen)} questionId={question.id} />
        <ReportsModal isOpen={isReportsModalOpen} onClose={closeModal(setReportsModalOpen)} questionId={question.id} />

        {/* --- Back Link --- */}
        <div className="w-full mb-4">
            <button
                onClick={() => router.push("/start")} // Navigate back to generation page
                className="text-green-500 text-lg hover:underline"
            >
                &larr; {t("BackToGenerateQuizPage")}
            </button>
        </div>

        {/* --- Header --- */}
        <QuizHeader
            quizType={quizType}
            initialTime={initialTime} // Pass initial time
            timeLeft={timeLeft} // Pass current time
            onTimeChange={handleTimeChange} // Pass handler
            onTimeUp={handleTimeUp} // Pass handler
            showResultsPage={showResultsPage}
            // Icon handlers
            onOpenReport={openModal(setReportsModalOpen)}
            onOpenFavorites={openModal(setFavModalOpen)}
            onOpenNotes={openModal(setNotesModalOpen)}
            onCopy={() => { // Keep copy logic simple here
                navigator.clipboard.writeText(question.text)
                    .then(() => toast.success(t("Copied")))
                    .catch(err => console.error("Failed to copy text: ", err));
            }}
            // Hint handlers
            showHint={showHint}
            showVideoHint={showVideoHint}
            onShowHintToggle={() => {setShowHint(s => !s); setShowVideoHint(false);}}
            onShowVideoHintToggle={() => {setShowVideoHint(s => !s); setShowHint(false);}}
            hasHint={!!question.hint}
            hasVideoHint={!!question.video_hint}
        />

        {/* --- Main Content (Results or Quiz) --- */}
        {showResultsPage ? (
            <QuizResults
                score={resultsData?.score}
                correctCount={resultsData?.correctCount}
                totalQuestions={resultsData?.totalQuestions}
                quizType={quizType}
                onReview={onEnterReviewMode} // Use handler from props
                onGoHome={() => router.push('/')} // Navigate home
            />
        ) : (
            <div className="w-full flex flex-wrap gap-4 mt-4">
                {/* --- Number Navigation --- */}
                 <div className="w-[10%] md:w-full max-h-[416px] md:h-auto pt-2">
                     <NumberScroll
                        numbers={numbersArray} // Pass [0, 1, 2...]
                        selected={questionIndex} // Current index
                        historyProgress={progress} // Pass the whole progress object
                        onNumberClicked={(index) => onNavigate(index)} // Use navigation handler
                        examType={quizType}
                        reviewMode={reviewMode} // Pass review mode status
                        selectedNumber={questionIndex}        
                        answers={quizType === "study" || reviewMode}
                    />
                 </div>

                 {/* --- Question Area --- */}
                <div className="w-[85%] md:w-full mt-2 flex-grow">
                    {/* Hints Display */}
                    <HintDisplay questions={question} showHint={showHint} />
                    {showVideoHint && (
                        <div className="w-full rounded-xl p-4 mb-4 text-center bg-gray-100">
                            {question.video_hint ? (
                                <YouTubePlayer url={question.video_hint} /> // Assuming YouTubePlayer exists
                            ) : (
                                <p className="text-gray-500">{t("NoVideoAvailable")}</p>
                            )}
                        </div>
                    )}

                    {/* Question Text and Options */}
                    <QuestionDisplay
                        question={question}
                        showHint={showHint} // For highlighting text
                        selectedAnswerIndex={selectedAnswerIndex} // Pass local selection state
                        onAnswerSelect={handleAnswerSelect} // Pass handler
                        isDisabled={isAnswered} // Determine if options should be disabled
                        progressForQuestion={currentQuestionProgress} // Pass progress for this specific question
                        reviewMode={reviewMode}
                        quizType={quizType}
                    />
                </div>
            </div>
        )}

        {/* --- Footer Controls --- */}
        {!showResultsPage && (
            <QuizControls
                questionIndex={questionIndex}
                totalQuestions={totalQuestions}
                isAnswered={isAnswered}
                isSelected={selectedAnswerIndex !== null}
                quizType={quizType}
                reviewMode={reviewMode}
                onPrev={handlePrev}
                onNext={handleNext}
                onCheckOrSubmit={handleCheckOrSubmit} // Single handler for check/submit/finish logic
                onResumeLater={onResumeLater} // Pass handler from props
            />
        )}
    </div>
  );
};

export default QuestionWindow;


// --- Sub-Component Definitions (Create these in separate files) ---

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
                    <Image style={{ cursor: "pointer" }} onClick={onOpenReport} className="mx-1" src={icon1} alt={t("ReportIssue")} width={30} height={30} title={t("ReportIssue")} />

                    {/* Study Mode Icons */}
                    {quizType === "study" && (
                        <>
                            {<Image style={{ cursor: "pointer" }} onClick={onShowHintToggle} className={`mx-1 `} src={hint} alt={t("ShowHint")} width={30} height={30} title={t("ShowHint")} />}
                            {<Image style={{ cursor: "pointer" }} onClick={onShowVideoHintToggle} className={`mx-1`} src={video_hint} alt={t("ShowVideoHint")} width={30} height={30} title={t("ShowVideoHint")} />}
                             <Image style={{ cursor: "pointer" }} onClick={onCopy} className="mx-1" src={copy} alt={t("CopyQuestion")} width={30} height={30} title={t("CopyQuestion")} />
                        </>
                    )}
                     {/* Favourite Icon */}
                    <Image style={{ cursor: "pointer" }} onClick={onOpenFavorites} className="mx-1" src={icon2} alt={t("AddToFavourites")} width={30} height={30} title={t("AddToFavourites")} />
                     {/* Notes Icon */}
                    <Image style={{ cursor: "pointer" }} onClick={onOpenNotes} className="mx-1" src={icon3} alt={t("AddNote")} width={30} height={30} title={t("AddNote")} />
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

// src/pages/components/Quiz/QuestionDisplay.js
const QuestionDisplay = ({ question, showHint, selectedAnswerIndex, onAnswerSelect, isDisabled, progressForQuestion, reviewMode, quizType }) => {
    const { t } = useTranslation("common");
    // Import QuestionItem
    // ... import QuestionItem

    // Calculate highlighted text only when showHint is true
    const highlightedText = useMemo(() => {
        if (!showHint || !question?.hint || !question?.text) {
            return question?.text || "";
        }
        const valuesToHighlight = new Set(question.hint.split(" ").map(value => value.trim()).filter(Boolean));
        return question.text.split(" ").map((word, index, words) => (
            <span
                key={index}
                style={{ backgroundColor: valuesToHighlight.has(word.replace(/[.,!?;:]$/, '')) ? "yellow" : "transparent" }} // Simple highlight logic
            >
                {word}{index < words.length - 1 ? " " : ""}
            </span>
        ));
    }, [question?.text, question?.hint, showHint]);

    return (
        <div className="w-full bg-blue-50 rounded-xl p-4">
            {/* Question Text */}
            <p className="text-lg font-semibold text-black mb-4">
                {/* Use highlighted text if showHint is true, otherwise plain text */}
                {showHint ? highlightedText : question?.text}
            </p>

             {/* Answer Options */}
            <div className="w-full mt-4 space-y-3">
                {question?.answers?.map((option, index) => {
                    let answerState = "idle"; // Default state: idle, correct, wrong
                    const isSelected = selectedAnswerIndex === index; // Is this option currently selected by the user?

                    // Determine state based on progress (if available) and mode
                    if ((quizType === 'study' || reviewMode) && progressForQuestion) {
                         const correctAnswerText = progressForQuestion.correct_answer;
                         const submittedAnswerText = progressForQuestion.answer;

                        if (option.answer_text === correctAnswerText) {
                             answerState = "correct"; // This is the correct answer
                        } else if (option.answer_text === submittedAnswerText) {
                            answerState = "wrong"; // This was the submitted *wrong* answer
                        }
                    }

                    return (
                        <QuestionItem
                            key={index}
                            question={option.answer_text}
                            image={option.image}
                            index={index}
                            // Determine visual state:
                            // - 'correct' or 'wrong' if answered (in study/review)
                            // - 'idle' otherwise
                            answerState={answerState}
                            // Determine if visually selected:
                            // - If it's the one user clicked OR if it was the submitted answer (correct or wrong)
                            isSelected={isSelected || (progressForQuestion?.answer === option.answer_text)}
                            // Disable clicking if already answered/submitted
                            is_disabled={isDisabled}
                            onAnswer={onAnswerSelect} // Pass the selection handler
                        />
                    );
                })}
            </div>
        </div>
    );
};

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
                    {t("<")} {/* Or use < */}
                </button>
                <button
                    onClick={onNext}
                    disabled={isLastQuestion}
                     // In study mode, only enable next if answered OR if skipping is intended (could add skip button)
                    // disabled={isLastQuestion || (quizType === 'study' && !isAnswered && !reviewMode)}
                    className={`w-32 sm:w-28 bg-blue-100 text-blue-500 rounded-lg py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {t(">")} {/* Or use > */}
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

// Remember to also update src/pages/components/Quiz/NumberScroll.js if its props need adjusting
// e.g., it now receives `numbers` as [0, 1, 2...], `selected` as the index,
// `historyProgress` as the object, `onNumberClicked` expects the index.

// Make sure all imports (icons, components, utils, hooks) are correct in each file.