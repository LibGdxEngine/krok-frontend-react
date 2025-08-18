// components/FlowingIcons.js
import React from 'react';

const icons = [
    '📘', '📗', '📙', '📕', '📓', '📒', '📚', '📖','📘', '📗', '📙', '📕', '📓', '📒', '📚', '📖'
];

const FlowingIcons = () => {
    return (
        <div className="relative w-full h-64 overflow-hidden">
            {icons.map((icon, index) => (
                <div
                    key={index}

                    className={`absolute text-4xl animate-flow-1 opacity-20`}
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `0s`
                    }}
                >
                    {icon}
                </div>
            ))}
        </div>
    );
};

export default FlowingIcons;
