// src/pages/quiz.js (Refactored)

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

import NavBarContainer from "../components/layout/NavbarContainer"; // Corrected import path
import Footer from "../components/layout/Footer";
import QuestionWindow from "../components/Quiz/QuestionWindow"; // Updated component name/path if needed
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SplashScreen from "../components/common/SplashScreen"; // Assuming SplashScreen exists

import {
  getExamJourney,
  updateExamJourney,
} from "@/components/services/questions";
// Import the default export from arrayUtils.js
// You can name it 'rearrangeArrayById' or anything else you prefer
import rearrangeArrayById from "@/components/utils/arrayUtils";

// Import the default export from timeUtils.js
// You can name it 'timeToSeconds' or anything else you prefer
import timeToSeconds from "@/components/utils/timeUtils";

const Quiz = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { token } = useAuth();
  const { id: examJourneyId, q: queryQuestionIndex } = router.query; // Use clearer names

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examData, setExamData] = useState(null); // Holds the entire exam object { questions, progress, type, time_left, ... }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Zero-based index
  const [reviewMode, setReviewMode] = useState(false); // Renamed from reviewExam for clarity
  const [showResultsPage, setShowResultsPage] = useState(false); // Explicit state for results view

  // --- Derived State (using useMemo for efficiency) ---
  const questions = useMemo(() => examData?.questions || [], [examData]);
  const progress = useMemo(() => examData?.progress || {}, [examData]);
  const quizType = useMemo(() => examData?.type, [examData]);
  const initialTime = useMemo(() => {
    if (!examData) return 0;
    const defaultTime = quizType === "exam" ? questions.length * 60 : 0; // 1 min per question for exam, 0 for study
    return timeToSeconds(examData.time_left, defaultTime);
  }, [examData, questions.length, quizType]);

  const totalQuestions = useMemo(() => questions.length, [questions]);

  // --- Effects ---

  // Effect to initialize currentQuestionIndex from query param or progress
  useEffect(() => {
    if (examData) {
      const initialIndex = parseInt(queryQuestionIndex, 10);
      if (
        !isNaN(initialIndex) &&
        initialIndex >= 0 &&
        initialIndex < totalQuestions
      ) {
        setCurrentQuestionIndex(initialIndex);
      } else if (
        examData.current_question !== undefined &&
        examData.current_question !== null &&
        examData.current_question < totalQuestions
      ) {
        // Fallback to the last known question from the backend if query param is invalid
        setCurrentQuestionIndex(examData.current_question);
      } else {
        // Default to 0 if nothing else is valid
        setCurrentQuestionIndex(0);
      }
      setLoading(false); // Ensure loading is false after examData is processed
    }
  }, [examData, queryQuestionIndex, totalQuestions]);

  // Effect to fetch exam data
  useEffect(() => {
    if (token && examJourneyId) {
      setLoading(true);
      setError(null); // Reset error on new fetch
      getExamJourney(token, examJourneyId)
        .then((response) => {
          // Ensure questions and progress exist before rearranging
          const initialQuestions = response.questions || [];
          const initialProgress = response.progress || []; // Assuming progress might contain IDs for ordering

          // Prepare progress data for rearrangeArrayById if necessary
          // This assumes response.progress is an array of objects like [{id: 'someId', ...}, ...]
          // If response.progress is an object like {'0': {...}, '1': {...}}, adapt this logic
          // For now, assuming it might be an array from the original rearrange function usage context
          const progressArrayForSort = Array.isArray(initialProgress)
            ? initialProgress
            : Object.values(initialProgress).map((p, idx) => ({
                ...p,
                id: p.id || questions[idx]?.id,
              })); // Adapt based on actual progress structure

          const orderedQuestions = rearrangeArrayById(
            initialQuestions,
            progressArrayForSort
          );

          setExamData({
            ...response,
            questions: orderedQuestions,
            // Ensure progress is an object keyed by question index for easier lookup later
            progress: Array.isArray(response.progress)
              ? response.progress.map((item) => {
                  return {
                    ...item, // This spreads all existing properties of the item
                    is_disabled: true, // This adds the new 'is_disabled' attribute with a value of true
                  };
                })
              : response.progress || {}, // Keep as is if already an object
          });
        })
        .catch((err) => {
          console.error("Error fetching exam:", err);
          setError(t("ErrorLoadingQuiz")); // User-friendly error message
          setLoading(false);
        });
      // .finally(() => {
      // Moved setLoading(false) inside the .then and .catch to ensure it happens after state update or error
      // setLoading(false);
      // });
    } else if (!token) {
      // Handle case where user is not authenticated
      setLoading(false);
      setError(t("PleaseLogin"));
      // Optional: redirect to login
      // router.push('/login');
    }
  }, [token, examJourneyId, t]); // Added t to dependency array

  // --- Event Handlers (using useCallback) ---

  // Handles updating the URL and state for navigation
  const handleNavigate = useCallback(
    (newIndex) => {
      if (newIndex >= 0 && newIndex < totalQuestions) {
        setCurrentQuestionIndex(newIndex);
        // Update URL without page reload
        router.push(`/quiz?id=${examJourneyId}&q=${newIndex}`, undefined, {
          shallow: true,
        });
        setReviewMode(false); // Exit review mode when navigating manually
      }
    },
    [totalQuestions, router, examJourneyId]
  );

  // Handles submitting an answer
  const handleAnswerSubmit = useCallback(
    async (
      questionIndex,
      selectedAnswerText,
      selectedAnswerIndex,
      timeLeft
    ) => {
      if (!token || !examJourneyId || !examData || !questions[questionIndex]) {
        console.error("Cannot submit answer: Missing data");
        // Optionally show a toast error
        return; // Exit if essential data is missing
      }

      const currentQuestion = questions[questionIndex];
      const currentQuestionId = currentQuestion.id; // Assuming questions have unique IDs
      const submissionData = {
        time_left: timeLeft, // Send time left as number of seconds
        progress: {
          // Send only the progress for the *current* question being answered
          [questionIndex.toString()]: {
            question_id: currentQuestionId, // Include question ID if needed by backend
            question_text: currentQuestion.text,
            answer: selectedAnswerText,
            // is_correct, correct_answer will be added by the backend response
          },
        },
        current_question: questionIndex,
      };

      try {
        // Optimistic UI update (optional, makes UI feel faster)
        setExamData((prevData) => ({
          ...prevData,
          progress: {
            ...prevData.progress,
            [questionIndex.toString()]: {
              ...(prevData.progress?.[questionIndex.toString()] || {}), // Keep existing progress data if any
              question_id: currentQuestionId,
              question_text: currentQuestion.text,
              answer: selectedAnswerText,
              is_disabled: true, // Mark as attempting/disabled
              is_pending: true,
            },
          },
        }));

        const response = await updateExamJourney(
          token,
          examJourneyId,
          submissionData
        );

        // Update state with the response from the backend
        setExamData((prevData) => ({
          ...prevData,
          progress: {
            ...prevData.progress, // Keep existing progress
            ...response.progress, // Add/overwrite with the updated progress from backend for this question
            // Ensure the received progress item is marked as disabled visually if needed
            [questionIndex.toString()]: {
              ...(response.progress?.[questionIndex.toString()] || {}),
              is_disabled: true, // Explicitly mark as disabled after successful check
              is_pending: false,
            },
          },
          time_left:
            response.time_left !== undefined
              ? response.time_left
              : prevData.time_left, // Update time if backend sends it
          current_question:
            response.current_question !== undefined
              ? response.current_question
              : questionIndex, // Update index if backend sends it
        }));

        // Automatic navigation in 'exam' mode after successful submission
        if (quizType === "exam" && questionIndex < totalQuestions - 1) {
          handleNavigate(questionIndex + 1);
        } else if (
          quizType === "exam" &&
          questionIndex === totalQuestions - 1
        ) {
          // If it was the last question in exam mode, potentially show results
          // Check if *all* questions are answered before showing results automatically
          // Note: This check might be complex depending on how progress is structured
          const allAnswered =
            Object.keys(examData.progress).length + 1 >= totalQuestions; // +1 for the one just submitted
          if (allAnswered) {
            setShowResultsPage(true);
          }
        }
      } catch (error) {
        console.error("Error updating exam:", error);
        // Revert optimistic update on failure
        setExamData((prevData) => ({
          ...prevData,
          progress: {
            ...prevData.progress,
            [questionIndex.toString()]: {
              ...(prevData.progress?.[questionIndex.toString()] || {}),
              is_disabled: false, // Re-enable selection
              is_pending: false, // Remove pending status
              // Remove is_correct if it was set optimistically (unlikely for this scenario)
            },
          },
        }));
      }
    },
    [
      token,
      examJourneyId,
      examData,
      questions,
      quizType,
      totalQuestions,
      handleNavigate,
      t,
    ]
  ); // Dependencies

  // Handle finishing the quiz (e.g., clicking Finish/Submit on last question or timer runs out)
  const handleFinishQuiz = useCallback(
    async (finalTimeLeft) => {
      setShowResultsPage(true);
      // Optional: Send a final update to the backend if needed
      if (token && examJourneyId && examData && finalTimeLeft !== undefined) {
        try {
          await updateExamJourney(token, examJourneyId, {
            time_left: finalTimeLeft,
            // Optionally send final state if backend requires it
            // progress: examData.progress,
            current_question: currentQuestionIndex,
            // status: 'completed' // If your backend supports a status
          });
        } catch (error) {
          console.error("Error sending final quiz update:", error);
        }
      }
    },
    [token, examJourneyId, examData, currentQuestionIndex]
  ); // Added currentQuestionIndex

  const handleResumeLater = useCallback(() => {
    // Optionally send current state to backend before navigating away
    // updateExamJourney(...)
    router.push("/"); // Navigate home or to dashboard
  }, [router]);

  const handleEnterReviewMode = useCallback(() => {
    setShowResultsPage(false); // Hide results page
    setReviewMode(true); // Enter review mode
    handleNavigate(0); // Start review from the first question
  }, [handleNavigate]);

  // --- Render Logic ---
  if (loading) {
    // Consistent Skeleton Loading
    return (
      <div className="w-full h-full flex flex-col items-start justify-center bg-white">
        <NavBarContainer />
        <div className="w-full p-6 max-w-5xl mx-auto">
          <Skeleton height={40} width={250} /> {/* Title Area */}
          <div className="flex justify-between items-center mt-4">
            <Skeleton height={30} width={150} /> {/* Icons Area */}
            <Skeleton height={30} width={100} /> {/* Timer Area */}
          </div>
          <div className="flex gap-4 mt-4">
            <Skeleton height={400} width={120} /> {/* Number Scroll Area */}
            <div className="flex-1">
              <Skeleton height={50} /> {/* Question Text */}
              <div className="mt-4 space-y-3">
                <Skeleton height={40} /> {/* Answer Option */}
                <Skeleton height={40} /> {/* Answer Option */}
                <Skeleton height={40} /> {/* Answer Option */}
                <Skeleton height={40} /> {/* Answer Option */}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <Skeleton height={40} width={100} /> {/* Prev Button */}
              <Skeleton height={40} width={100} /> {/* Next Button */}
            </div>
            <div className="flex gap-2">
              <Skeleton height={40} width={120} /> {/* Resume Later */}
              <Skeleton height={40} width={120} /> {/* Check/Submit Button */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <NavBarContainer />
        <div className="flex-grow flex items-center justify-center text-red-600 text-xl">
          {error}
        </div>
        <Footer />
      </div>
    );
  }

  if (!examData || !questions || questions.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <NavBarContainer />
        <div className="flex-grow flex items-center justify-center text-gray-600 text-xl">
          {t("NoQuestionsFound")}
        </div>
        <Footer />
      </div>
    );
  }

  // Find the actual question object for the current index
  const currentQuestionData = questions[currentQuestionIndex];

  if (!currentQuestionData && !loading && totalQuestions > 0) {
    // Handle case where index might be out of bounds after data load, redirect to first question
    console.warn(
      `Question index ${currentQuestionIndex} out of bounds. Redirecting to 0.`
    );
    handleNavigate(0);
    return <SplashScreen />; // Show loading while redirecting
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-start justify-center bg-white">
      <NavBarContainer />
      <main className="w-full flex-grow flex items-start justify-center">
        {currentQuestionData ? (
          <QuestionWindow
            // --- Core Data ---
            examJourneyId={examJourneyId}
            question={currentQuestionData} // Pass the specific question object
            questionIndex={currentQuestionIndex} // Pass the index
            totalQuestions={totalQuestions}
            quizType={quizType}
            progress={progress} // Pass the whole progress object { '0': {...}, '1': {...} }
            initialTime={initialTime} // Pass initial time in seconds
            reviewMode={reviewMode}
            showResultsPage={showResultsPage} // Control results view visibility
            // --- Callbacks ---
            onAnswerSubmit={handleAnswerSubmit}
            onNavigate={handleNavigate} // Pass the navigation handler
            onFinishQuiz={handleFinishQuiz}
            onResumeLater={handleResumeLater}
            onEnterReviewMode={handleEnterReviewMode} // Pass review mode handler
            // TODO: Add callbacks for modals (Favourites, Notes, Reports) if needed at this level
          />
        ) : (
          // This case should ideally be handled by the loading/error/no-questions states above
          // But as a fallback:
          <div className="flex-grow flex items-center justify-center text-gray-600 text-xl">
            {t("LoadingQuestion")}
          </div>
        )}
      </main>
      {/* Added some margin-top for spacing before footer */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default Quiz;
