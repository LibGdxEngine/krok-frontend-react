import { useState, useEffect } from 'react';

const CountUpTimer = ({ max, onTimeChange ,start=0}) => {
    const [seconds, setSeconds] = useState(start);

    useEffect(() => {
        // Function to update the timer
        const tick = () => {
            setSeconds(prevSeconds => {
                if (prevSeconds >= max - 1) {
                    clearInterval(timerId);
                    return max;
                }
                return prevSeconds + 1;
            });
        };

        // Set interval to update the timer every second
        const timerId = setInterval(tick, 1000);
        return () => clearInterval(timerId);
    }, [max]);

    useEffect(() => {
        onTimeChange(seconds);
    }, [seconds, onTimeChange]);

    // Convert seconds to minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        <div className={`block text-black`}>
            {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
        </div>
    );
};

export default CountUpTimer;
