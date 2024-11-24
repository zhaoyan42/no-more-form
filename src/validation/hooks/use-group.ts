import { useCallback, useState } from "react";
import type { Validation } from "../validation.ts";
import { useValidationSet } from "../validation.ts";

export interface Group {
  isValid: boolean;
  touched: boolean;
  validate: () => void;
  addToGroup: (key: string, validation: Validation) => void;
}

export function useGroup() {
  const [touched, setTouched] = useState(false);
  const validationSet = useValidationSet();

  const validate = useCallback(() => {
    setTouched(true);
  }, []);

  const addToGroup = useCallback(
    (key: string, validation: Validation) => {
      validationSet.addValidation(key, validation);
    },
    [validationSet],
  );

  return {
    touched,
    validate,
    addToGroup,
    get isValid() {
      return validationSet.isValid;
    },
  } satisfies Group as Group;
}
