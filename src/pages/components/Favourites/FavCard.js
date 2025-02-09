import React from 'react';

const FavCard = ({ title , numOfQuestions, onDeleteClicked=null, onShowQuestionsClicked=null}) => {
    return (
        <div className="h-40 bg-white border-2 border-dashed p-4 rounded-lg flex flex-col justify-between w-full max-w-sm">
            <div>
                <h3 className="font-semibold text-lg text-black">{title}</h3>
                <p className="text-gray-500">{numOfQuestions} {numOfQuestions === 1 ? "question" : "questions"}</p>
            </div>
            <div className="flex w-full justify-between mt-4">
                <div className="flex space-x-4">
                    <button onClick={()=>{
                        if (onDeleteClicked) {
                            onDeleteClicked();
                        }
                    }} className="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <button onClick={()=>{
                    if (onShowQuestionsClicked) {
                        onShowQuestionsClicked();
                    }
                }} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Show Questions
                </button>
            </div>
        </div>
    );
};

export default FavCard;
