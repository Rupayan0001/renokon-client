import { useEffect, useRef, useState } from "react";

const usePrev = (value) => {
  const previousValue = useRef(null); // Ensure it starts as `null`
  const [prev, setPrev] = useState(null); // Local state to force re-render

  useEffect(() => {
    setPrev(previousValue.current);
    previousValue.current = value;
  }, [value]);

  return prev;
};

export default usePrev;
