import React, {useEffect, useRef, useState} from 'react';
import NumberItem from "@/pages/components/Quiz/NumberItem";

const NumberScroll = ({
  numbers,
  selected,
  onNumberClicked,
  skipped = [],
  answers = null,
  historyProgress,
  selectedNumber,
  setSelectedNumber
}) => {


  const handleNumberClick = (number) => {
    onNumberClicked(number);
    setSelectedNumber(number);
  };
  const itemRefs = useRef([]); // Array of refs to store each NumberItem ref
  const containerRef = useRef(null); // Ref for the parent scrollable container
  useEffect(() => {
    if (selectedNumber !== null && itemRefs.current[selectedNumber]) {
      itemRefs.current[selectedNumber].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedNumber]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-blue-100  rounded-lg overflow-auto h-full md:h-auto md:gap-x-2 md:flex p-2 scrollbar"
    >
      {numbers &&
        numbers.map((number, index) => (
          <div key={number} ref={(el) => (itemRefs.current[number] = el)}>
            <NumberItem
              number={index + 1}
              answer={
                historyProgress[number]
                  ? historyProgress[number].is_correct
                  : null
              }
              isSelected={parseInt(number) === selected}
              isSkipped={skipped.includes(number)}
              onClick={() => handleNumberClick(number)}
              // isNotSelected={historyProgress[number.toString()]?.is_disabled}
            />
          </div>
        ))}
    </div>
  );
};

export default NumberScroll;
