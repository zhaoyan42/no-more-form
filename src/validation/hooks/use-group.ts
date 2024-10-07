import { useCallback, useState } from "react";
import type { Validation } from "../validation.ts";
import { ValidationSet } from "../validation.ts";

export interface Group {
  isValid: boolean;
  touched: boolean;
  validate: () => void;
  addValidation: (validation: Validation) => void;
}

export function useGroup() {
  const [touched, setTouched] = useState(false);

  const validate = useCallback(() => {
    setTouched(true);
  }, []);

  const validateSet = new ValidationSet();

  const addValidation = (validation: Validation) => {
    validateSet.addValidation(validation);
  };

  return {
    touched,
    validate,
    addValidation,
    isValid: validateSet.isValid,
  } satisfies Group as Group;
}
