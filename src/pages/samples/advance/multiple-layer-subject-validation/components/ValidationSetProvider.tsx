import type { ReactNode } from "react";
import type { ValidationSet } from "@/validation/hooks/use-validation-set";
import { ValidationSetContext } from "../context/ValidationSetContext";

interface ValidationSetProviderProps {
  validationSet: ValidationSet;
  children: ReactNode;
}

export function ValidationSetProvider({
  validationSet,
  children,
}: ValidationSetProviderProps) {
  return (
    <ValidationSetContext.Provider value={validationSet}>
      {children}
    </ValidationSetContext.Provider>
  );
}
