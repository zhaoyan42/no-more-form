import { useCallback, useState } from "react";

export interface Group {
  touched: boolean;
  showResults: () => void;
}

export function useGroup() {
  const [touched, setTouched] = useState(false);

  const showResults = useCallback(() => {
    setTouched(true);
  }, []);

  return {
    touched,
    showResults: showResults,
  } satisfies Group as Group;
}
