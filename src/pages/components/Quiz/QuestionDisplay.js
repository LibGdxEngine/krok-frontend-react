import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import QuestionItem from "@/pages/components/Quiz/QuestionItem";

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
                            is_pending={progressForQuestion?.is_pending} // Use is_pending from progress
                            onAnswer={onAnswerSelect} // Pass the selection handler
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default memo(QuestionDisplay);