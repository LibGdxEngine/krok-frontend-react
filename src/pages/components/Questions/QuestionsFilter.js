import React, { useState } from 'react';

const QuestionsFilter = ({ onChange = null }) => {
    const [checkboxState, setCheckboxState] = useState({
        'All': true,
        'Unused Questions': true,
        'Used Questions': true,
        'Correct Questions': true,
        'Incorrect Questions': true
    });

    const handleCheckboxChange = (text, checked) => {
        let updatedState;

        if (text === 'All') {
            updatedState = {
                'All': checked,
                'Unused Questions': checked,
                'Used Questions': checked,
                'Correct Questions': checked,
                'Incorrect Questions': checked
            };
        } else {
            updatedState = { ...checkboxState, [text]: checked };
            const allChecked = Object.keys(updatedState)
                .filter(key => key !== 'All')
                .every(key => updatedState[key]);

            updatedState['All'] = allChecked;
        }

        setCheckboxState(updatedState);

        if (onChange) {
            onChange(updatedState);
        }
    };

    return (
        <div className="w-full bg-blue-50 p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Questions filter</h2>
            <ul className="space-y-2">
                {['All', 'Unused Questions', 'Used Questions', 'Correct Questions', 'Incorrect Questions'].map((text, index) => (
                    <li key={index} className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox text-blue-500"
                            checked={checkboxState[text]}
                            onChange={(event) => handleCheckboxChange(text, event.target.checked)}
                        />
                        <span className="ml-2 text-blue-900">{text}</span>
                    </li>
                ))}
                <li className="mt-4">
                    <label className="flex items-center text-gray-400">
                        <input type="checkbox" className="form-checkbox text-gray-400" disabled />
                        <span className="ml-2">Generate questions you have wrongly answered</span>
                    </label>
                </li>
            </ul>
        </div>
    );
};

export default QuestionsFilter;
