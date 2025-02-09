// components/QuestionCard.js

import React from 'react';

const QuestionCard = ({question}) => {
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
            <p className="text-gray-700 text-base mb-4">{question.text}</p>
            <div className="font-bold text-lg mb-2 text-black">Correct Answer</div>
            <p className="text-gray-700 text-base">{question.correct_answer}</p>
        </div>
    );
};

export default QuestionCard;
