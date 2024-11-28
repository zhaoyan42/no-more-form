import { useCallback, useState } from "react";

export interface Group {
  touched: boolean;
  validate: () => void;
}

export function useGroup() {
  const [touched, setTouched] = useState(false);

  const validate = useCallback(() => {
    setTouched(true);
  }, []);

  return {
    touched,
    validate,
  } satisfies Group as Group;
}
