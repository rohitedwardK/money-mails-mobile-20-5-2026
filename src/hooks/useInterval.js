import {useEffect, useRef, useState} from 'react';

export function useInterval(callback) {
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(false);
  const firstStart = useRef(true);
  const tick = useRef();

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
      return;
    }
    if (start) {
      tick.current = setInterval(() => {
        setTimer(timer => {
          callback(timer + 1);
          return timer + 1;
        });
      }, 1000);
    } else {
      clearInterval(tick.current);
    }

    return () => clearInterval(tick.current);
  }, [start]);

  const toggleStart = shouldStart => {
    setStart(shouldStart);
    if (!shouldStart) setTimeout(() => setTimer(0), 1000);
  };

  return {
    start: () => toggleStart(true),
    stop: () => toggleStart(false),
    timer,
    setTimer
  };
}
