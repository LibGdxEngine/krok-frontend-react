import React, {useState} from 'react';
import NumberItem from "@/pages/components/Quiz/NumberItem";

const NumberScroll = ({numbers, selected = 0, onNumberClicked, skipped = [], answers = null , historyProgress}) => {
    const [selectedNumber, setSelectedNumber] = useState(null);

    const handleNumberClick = (number) => {
        onNumberClicked(number);
        setSelectedNumber(number);
    };
    
    return (
      <div className="w-fit bg-blue-100  rounded-lg overflow-y-auto h-full p-2 scrollbar">
        {numbers &&
          numbers.map((number) => (
            <NumberItem
              key={number}
              number={number}
              answer={
                answers
                  ? number < selected + 1
                    ? answers[number - 1]
                    : answers[number - 1]
                  : null
              }
              isSelected={number === selected + 1}
              isSkipped={skipped.includes(number - 1)}
              onClick={handleNumberClick}
              isNotSelected={historyProgress[(number-1).toString()]?.isDisabled}
            />
          ))}
      </div>
    );
};

export default NumberScroll;
