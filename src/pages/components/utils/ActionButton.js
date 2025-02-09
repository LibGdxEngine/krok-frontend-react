import React, { useState } from 'react';

function ActionButton({ text, className = "" }) {
    const [clicked, setClicked] = useState(false);

    // Function to handle button click
    const handleClick = () => {
        setClicked(true);

        // Reset the button state after a short delay
        setTimeout(() => {
            setClicked(false);
        }, 300);
    };

    return (
      <div
        id="button"
        className={`p-2 w-full  flex items-center justify-center text-white text-base rounded-8 bg-navyBlue ${className}`}
        onClick={handleClick} // Call handleClick function on button click
        style={{
          transition: "transform 0.3s ease", // Add transition for transform property
          transform: clicked ? "scale(0.95)" : "scale(1)", // Apply scaling transformation when clicked
        }}
      >
        {text}
      </div>
    );
}

export default ActionButton;
