// src/pages/components/Quiz/QuestionWindow.js (Refactored)

import NumberScroll from "@/pages/components/Quiz/NumberScroll";


import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/router"; // Keep for non-quiz navigation (e.g., Home, Back to Generate)
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// --- Import Sub-Components (Create these files) ---
import QuizHeader from "../../pages/components/Quiz/QuizHeader";
// import NumberScroll from "./NumberScroll";
import QuestionDisplay from "../../pages/components/Quiz/QuestionDisplay";
import QuizControls from "../../pages/components/Quiz/QuizControls";
import QuizResults from "../../pages/components/Quiz/QuizResults";
import HintDisplay from "../../pages/components/Quiz/HintDisplay"; // Assuming HintDisplay exists and is okay
import YouTubePlayer from "../../pages/components/utils/YouTubePlayer";
// --- Import Modals & Utils ---
import FavoritesModal from "@/pages/components/Favourites/FavoritesModal";
import NotesModal from "@/pages/components/utils/NotesModal";
import ReportsModal from "@/pages/components/utils/ReportsModal";
import SplashScreen from "@/components/common/SplashScreen"; // For missing question case


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

    const handleNext = useCallback(() => {
        if (questionIndex < totalQuestions - 1) {
            onNavigate(questionIndex + 1);
        }
    }, [questionIndex, totalQuestions, onNavigate]);

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
        if (isAnswered && !isLast) {
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
            if (allCurrentlyAnswered || (answeredJustNow && Object.keys(progress).length + 1 >= totalQuestions)) {
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
        progress, // progress needed to check if all answered
        handleNext
    ]);


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



    return (
        <div className="w-full max-w-5xl p-4 flex flex-col items-center justify-center bg-white">
            {/* --- Modals --- */}
            <FavoritesModal isOpen={isFavModalOpen} onClose={closeModal(setFavModalOpen)} question={question} />
            <NotesModal isOpen={isNotesModalOpen} onClose={closeModal(setNotesModalOpen)} question={question.id} />
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
                onShowHintToggle={() => { setShowHint(s => !s); setShowVideoHint(false); }}
                onShowVideoHintToggle={() => { setShowVideoHint(s => !s); setShowHint(false); }}
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

export default memo(QuestionWindow);










// Remember to also update src/pages/components/Quiz/NumberScroll.js if its props need adjusting
// e.g., it now receives `numbers` as [0, 1, 2...], `selected` as the index,
// `historyProgress` as the object, `onNumberClicked` expects the index.

// Make sure all imports (icons, components, utils, hooks) are correct in each file.