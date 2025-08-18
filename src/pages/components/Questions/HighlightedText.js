import React from 'react';

const HighlightedText = ({questions = "", csvString = ""}) => {
    console.log(questions, csvString)
    if (questions === undefined || questions === "" || csvString === undefined || csvString === "") {
        return;
    }
    // Step 1: Convert the comma-separated values into an array
    const valuesToHighlight = csvString.split(',').map(value => value.trim());

    // Step 2: Split the text into words
    const text = questions.text;
    const words = text ? text.split(' ') : [];

    // Step 3 & 4: Check each word against the array and highlight if necessary
    const newHighlightedText = words.map((word, index) => {
        console.log(index)
        const isHighlighted = valuesToHighlight.includes(word);
        return (
            <span
                key={index}
                style={{
                    backgroundColor: isHighlighted ? 'yellow' : 'transparent'
                }}
            >
        {word}
                {/* Adding a space after each word */}
                {index < words.length - 1 ? ' ' : ''}
      </span>
        );
    });

    return (
        <p className="text-lg font-bold">
            {newHighlightedText}
        </p>
    );
};

export default HighlightedText;
