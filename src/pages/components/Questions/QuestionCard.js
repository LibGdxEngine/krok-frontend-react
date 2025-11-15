// components/QuestionCard.js

import React from 'react';

// HighlightedText component with more robust highlighting
const HighlightedText = ({ text, searchTerm, shouldHighlight }) => {
    if (!shouldHighlight || !searchTerm || !text) {
        return <span>{text}</span>;
    }

    // Try to find the search term in the text
    if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
        // Create a case-insensitive RegExp for splitting
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);

        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <span key={i} className="bg-yellow-300 px-0.5 rounded font-medium">
                            {part}
                        </span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    }

    // If search term not found in text, just return the text
    return <span>{text}</span>;
};

const QuestionCard = ({ question, searchTerm }) => {
    if (!question) {
        return null;
    }
    return (
        <div className="max-w-md  overflow-hidden p-2 bg-white">
            <div className="font-bold text-xl mb-2 text-black">Question Filters</div>

            <div className="mb-4">
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                    {question.language}
                </span>
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                    {question.level}
                </span>
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                    {question.specificity}
                </span>
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                    {question.subjects[0]}
                </span>
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                    {question.systems[0]}
                </span>
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                    {question.topics[0]}
                </span>
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                    {question.years[0]}
                </span>
            </div>
            <div className="font-bold text-lg mb-2 text-black">Question Text</div>
            
            <p className="text-gray-700 text-base mb-4">
                <HighlightedText
                    text={question.text}
                    searchTerm={searchTerm}
                    shouldHighlight={question.match_source[0] === "question_text"}
                />
            </p>
            <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Answers</h3>
                <div className="space-y-2">
                    {question.all_answers.map((answer) => (
                        <div
                            key={answer.id}
                            className="text-black p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <HighlightedText
                                text={answer.text}
                                searchTerm={searchTerm}
                                shouldHighlight={question.match_source[0] === "answer"}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="font-bold text-lg mb-2 text-black">Correct Answer</div>
            <div
                className="text-black p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
            >
                <HighlightedText
                    text={question.correct_answer}
                    searchTerm={searchTerm}
                    shouldHighlight={question.match_source[0] === "correct_answer"}
                />
            </div>
        </div>
    );
};

export default QuestionCard;
