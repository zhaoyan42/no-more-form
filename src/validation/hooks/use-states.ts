import { useEffect, useRef, useState } from "react";

export interface FieldStates {
  dirty: boolean;
  touched: boolean;
  setTouched: (touched: boolean) => void;
}

export function useFieldState<T>(subject: T): FieldStates {
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);

  const initialState = useRef(subject);

  useEffect(() => {
    if (initialState.current !== subject) {
      setDirty(true);
    }
  }, [setDirty, subject]);

  return {
    dirty,
    touched,
    setTouched,
  } satisfies FieldStates;
}
