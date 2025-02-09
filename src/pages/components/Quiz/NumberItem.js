import React from 'react';

const NumberItem = ({ number,answer, isSelected,isSkipped=false, onClick ,isNotSelected=false}) => {
    let answerState = 0;
    
    if (answer === null || answer === undefined){
        answerState = "border-orange-300";
    }else if (answer === true){
        answerState = "border-green-500";
    }else{
        answerState = "border-orange-300";
    }
    if (!isNotSelected && !isSelected){
        answerState = "border-orange-500 bg-orange-500 text-white";
    }
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-center my-2 h-12 md:w-12 w-full cursor-pointer rounded-xl border ${answerState} font-semibold ${
          isSelected ? "bg-numbersBlue text-white" : "bg-blue-100 text-white"
        } ${isSkipped ? answerState : ""}`}
      >
        {number}
      </div>
    );
};

export default NumberItem;
