
import { useState, useEffect, useRef } from 'react';

export const useCountdown = (initialMinutes: number) => {
    const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            setTotalSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
    
    useEffect(() => {
        if (totalSeconds === 0 && intervalRef.current) {
             clearInterval(intervalRef.current);
        }
    }, [totalSeconds]);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        isFinished: totalSeconds === 0,
    };
};
