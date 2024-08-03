import React, { useEffect, useState } from 'react';

const QuestionsPractice = ({ onChange = null, selected, questionsCount }) => {
    const [numberOfQuestions, setNumberOfQuestions] = useState(questionsCount);

    const handleIncrease = () => {
        if (numberOfQuestions < 200) {
            setNumberOfQuestions((prevState) => prevState + 1);
        }
    };

    const handleDecrease = () => {
        if (numberOfQuestions > 0) {
            setNumberOfQuestions((prevState) => prevState - 1);
        }
    };

    useEffect(() => {
        onChange(numberOfQuestions);
    }, [numberOfQuestions, onChange]);

    useEffect(() => {
        setNumberOfQuestions(selected);
    }, []);

    return (
        <div className="w-full h-full bg-blue-50 p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-900 mb-4">How many questions do you want to practice?</h2>
            <div className="mb-4 text-gray-500">You can have up to {questionsCount} questions.</div>
            <div className="flex items-center space-x-2">
                <button onClick={handleDecrease} className="px-2 py-1 bg-blue-100 rounded">{"<"}</button>
                <input
                    type="text"
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                    className="w-12 text-center border border-gray-300 rounded"
                />
                <button onClick={handleIncrease} className="px-2 py-1 bg-blue-100 rounded">{">"}</button>
                <input
                    type="text"
                    className="w-16 text-center border border-gray-300 rounded"
                    value={questionsCount}
                    readOnly
                />
            </div>
        </div>
    );
};

export default QuestionsPractice;
