// components/QuestionCard.js
import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../../src/components/axiosInstance";

const QuestionCard = ({ number, question, answers }) => {


    const [searchQuery, setSearchQuery] = useState(question);
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // handleSearch moved inside useEffect

    useEffect(() => {
        const handleSearch = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(
                    `v1/questions/search/?q=${searchQuery}`
                );

                const data = response.data.results;


                if (data && data.length > 0) {
                    // Assuming the API returns an array of questions, and you want to use the first one
                    setQuestionData(data[0]);

                } else {
                    setError("No questions found");
                }
            } catch (err) {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            handleSearch();
        }
    }, [searchQuery]);

    if (!answers) {
        return <div>Loading...</div>
    }
    return (
        <div className="w-full px-8 mx-8 bg-white shadow-md rounded-lg p-6">
            {/* Loading state */}
            {loading && <div>Loading...</div>}

            {/* Error state */}
            {error && <div className="text-red-500">{error}</div>}

            {/* Question and answers display */}
            {questionData && (
                <>
                    <h1 className="text-2xl font-semibold mb-4 text-black">
                        Question {questionData.number}
                    </h1>
                    <h2 className="text-xl font-semibold mb-4 text-black">
                        {question}
                    </h2>
                    <ul className="grid grid-cols-1 gap-4">
                        {answers.map((answer, index) => (
                            <li key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`answer-${index}`}
                                    name="answers"
                                    value={answer.answer}
                                    className="mr-2"
                                />
                                <label htmlFor={`answer-${index}`} className="text-black">
                                    {answer.answer_text}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-green-700">
                        Correct Answer: {questionData.correct_answer}
                    </p>
                </>
            )}
        </div>
    );
};

export default QuestionCard;
