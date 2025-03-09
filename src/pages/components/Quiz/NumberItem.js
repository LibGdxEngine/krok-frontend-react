import React from 'react';

const NumberItem = ({ number,answer, isSelected,isSkipped=false, onClick ,isNotSelected=false}) => {
    let answerState = 0;
    if (answer === null || answer === undefined){
        answerState = "border-orange-300 bg-orange-500 text-white" ;
        console.log("not answered");
    }else if (answer === true){
        console.log("answered true")
        answerState = "border-green-500";
    }else{
        console.log("answered false")
        answerState = "border-red-600 text-red-600" ;
    }

    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-center my-2 border-2 h-12 md:w-12 w-full cursor-pointer rounded-xl border ${answerState} font-semibold ${
          isSelected ? "bg-white text-dark" : "bg-blue-100"
        } ${isSkipped ? answerState : ""}`}
      >

        {number}
      </div>
    );
};

export default NumberItem;
