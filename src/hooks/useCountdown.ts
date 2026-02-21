import { useState, useEffect } from 'react';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function useCountdown(targetDate: Date): Countdown {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
