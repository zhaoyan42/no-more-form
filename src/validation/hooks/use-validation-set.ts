import { useCallback, useMemo, useState } from "react";
import type { Validation } from "./use-validation.ts";

export interface ValidationSet {
  add: (key: string, validation: Validation) => void;
  validations: Record<string, Validation>;
  isValid: boolean;
}

export function useValidationSet() {
  const [validations, setValidations] = useState<Record<string, Validation>>(
    {},
  );

  const add = useCallback((key: string, validation: Validation) => {
    setValidations((prev) => ({
      ...prev,
      [key]: validation,
    }));
  }, []);

  return useMemo(
    () =>
      ({
        add,
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
    [add, validations],
  );
}
