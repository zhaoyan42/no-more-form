import { useEffect, useMemo, useRef, useState } from "react";

export interface ValidationStates {
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  touched: boolean;
  setTouched: (touched: boolean) => void;
}

export interface FieldStates {
  dirty: boolean;
  touched: boolean;
  setTouched: (touched: boolean) => void;
}

function useValidationStates(): ValidationStates {
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);

  return useMemo(
    () => ({
      dirty,
      setDirty,
      touched,
      setTouched,
    }),
    [dirty, touched],
  );
}

export function useFieldStates<T>(subject: T): FieldStates {
  const { dirty, setDirty, touched, setTouched } = useValidationStates();

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
