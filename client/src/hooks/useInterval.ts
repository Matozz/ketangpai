import { useEffect, useRef } from "react";

export default function useInterval(callback, delay) {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay - 9);
    return () => clearInterval(id);
  }, [delay]);
}
