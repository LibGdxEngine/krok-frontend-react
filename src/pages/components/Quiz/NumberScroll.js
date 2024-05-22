import React, {useState} from 'react';
import NumberItem from "@/pages/components/Quiz/NumberItem";

const NumberScroll = ({ numbers, selected=0 }) => {
    const [selectedNumber, setSelectedNumber] = useState(null);

    const handleNumberClick = (number) => {
        setSelectedNumber(number);
    };

    return (
        <div className="w-fit bg-blue-100  rounded-lg overflow-y-auto h-full p-2 scrollbar">
            {numbers.map((number) => (
                <NumberItem
                    key={number}
                    number={number}
                    isSelected={number === selected + 1}
                    onClick={handleNumberClick}
                />
            ))}
        </div>
    );
};

export default NumberScroll;