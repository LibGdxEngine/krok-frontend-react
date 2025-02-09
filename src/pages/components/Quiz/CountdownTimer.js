import {useState, useEffect} from 'react';

const CountdownTimer = ({initialSeconds, onTimeChange}) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        // Function to update the timer
        const tick = () => {
            setSeconds(prevSeconds => {
                if (prevSeconds <= 1) {
                    clearInterval(timerId);
                    return 0;
                }
                return prevSeconds - 1;
            });
        };

        // Set interval to update the timer every second
        const timerId = setInterval(tick, 1000);
        onTimeChange(seconds);
        // Clean up the interval on component unmount
        return () => clearInterval(timerId);
    }, [onTimeChange, seconds]);

    // Convert seconds to minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        <div className={`text-black`}>
            {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
        </div>
    );
};

export default CountdownTimer;