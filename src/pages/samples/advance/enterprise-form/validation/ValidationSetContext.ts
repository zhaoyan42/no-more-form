import { createContext, useContext } from "react";
import type { ValidationSet } from "@/validation/hooks/use-validation-set";

export const ValidationSetContext = createContext<ValidationSet | null>(null);

export function useValidationSetContext(): ValidationSet {
  const ctx = useContext(ValidationSetContext);
  if (!ctx) throw new Error("ValidationSetContext not found");
  return ctx;
}
