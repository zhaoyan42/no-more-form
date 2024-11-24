import { useCallback, useMemo, useState } from "react";
import type { RuleResultSet } from "./rule-result-set.ts";

export interface Validation {
  dirty: boolean;
  touched: boolean;
  setTouched: () => void;
  isValid: boolean;
  getResultSet: () => RuleResultSet;
}

interface ValidationSet {
  addValidation: (key: string, validation: Validation) => void;
  validations: Record<string, Validation>;
  isValid: boolean;
}

export function useValidationSet() {
  const [validations, setValidations] = useState<Record<string, Validation>>(
    {},
  );

  const addValidation = useCallback((key: string, validation: Validation) => {
    setValidations((prev) => ({
      ...prev,
      [key]: validation,
    }));
  }, []);

  return useMemo(
    () =>
      ({
        addValidation,
        validations: Array.from(Object.entries(validations)).reduce(
          (acc, [key, validation]) => {
            acc[key] = validation;
            return acc;
          },
          {} as Record<string, Validation>,
        ),
        isValid: Object.values(validations).every(
          (validation) => validation.isValid,
        ),
      }) satisfies ValidationSet as ValidationSet,
    [addValidation, validations],
  );
}
